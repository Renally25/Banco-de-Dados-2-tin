import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req, { params }) {
  const { CodEndereco } = params;

  const result = await pool.query(
    "SELECT * FROM Usuario WHERE CodEndereco = $1",
    [CodEndereco]
  );

  return NextResponse.json(result.rows[0]);
}