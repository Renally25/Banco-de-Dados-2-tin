import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(requisicao) {

    try {

        const { CodUsuario, cref } = await requisicao.json();

        if (!CodUsuario || !cref) {
            return NextResponse.json(
                { error: "Informações em branco." },
                { status: 400 }
            );
        }

         await pool.query(
            `INSERT INTO Treinador (CodUsuario, cref)
            VALUES ($1, $2)`,
            [CodUsuario, cref]
        );

        return NextResponse.json({ message: "Treinador cadastrado com sucesso!" }, { status: 201 })

    } catch (error) {
          if (error.code === "23505") {
            return NextResponse.json(
            { error: "CodUsuario já existe." },
            { status: 409 }
            );
        }

            return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function GET() {

    try {

        const result = await pool.query(`SELECT * FROM Treinador ORDER BY CodUsuario ASC;`);
        return NextResponse.json(result.rows);

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function DELETE(requisicao) {

    try {
        const { searchParams } = new URL(requisicao.url);
        const id = searchParams.get("CodUsuario");

        if (!id) {
            return NextResponse.json(
                { error: "Informe o CodUsuario para deletar." },
                { status: 400 }
            );
        }

            await pool.query(
            `DELETE FROM Treinador WHERE CodUsuario = $1`,
            [id]
        );

        return NextResponse.json({
            message: "Treinador deletado com sucesso!"
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}