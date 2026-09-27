"use client";

import { supabase } from "./supabase";
import { hashPassword } from "./crypto";
import type { Gift, GiftCreateInput } from "./types";

const ID_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const ID_LENGTH = 5;

function generateId(): string {
  let id = "";
  for (let i = 0; i < ID_LENGTH; i++) {
    id += ID_CHARS[Math.floor(Math.random() * ID_CHARS.length)];
  }
  return id;
}

export async function createGift(input: GiftCreateInput): Promise<Gift> {
  const passwordHash = await hashPassword(input.password);

  let attempts = 0;
  let id = generateId();

  while (attempts < 10) {
    const { data: existing } = await supabase
      .from("gifts")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (!existing) break;
    id = generateId();
    attempts++;
  }

  const row = {
    id,
    recipient_name: input.recipientName,
    message: input.message,
    occasion: input.occasion,
    experience_type: input.experienceType,
    password_hash: passwordHash,
    password_hint: input.passwordHint || null,
    creator_name: input.creatorName || null,
  };

  const { data, error } = await supabase
    .from("gifts")
    .insert(row)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return rowToGift(data);
}

export async function getGift(id: string): Promise<Gift | null> {
  const { data, error } = await supabase
    .from("gifts")
    .select("*")
    .eq("id", id.toUpperCase())
    .maybeSingle();

  if (error || !data) return null;

  return rowToGift(data);
}

function rowToGift(row: Record<string, unknown>): Gift {
  return {
    id: row.id as string,
    recipientName: row.recipient_name as string,
    message: row.message as string,
    occasion: row.occasion as Gift["occasion"],
    experienceType: row.experience_type as Gift["experienceType"],
    passwordHash: row.password_hash as string,
    passwordHint: (row.password_hint as string) || undefined,
    creatorName: (row.creator_name as string) || undefined,
    createdAt: row.created_at as string,
  };
}
