import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req, { params }) {
  const { CodConsulta } = params;

  const result = await pool.query(
    "SELECT * FROM Consulta WHERE CodConsulta = $1",
    [CodConsulta]
  );

  return NextResponse.json(result.rows[0]);
}