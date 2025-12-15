import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(requisicao) {

    try {

        const { CodUsuario, peso, altura, objetivo, dtCadastro } = await requisicao.json();

        if (!CodUsuario || !peso || !altura || !objetivo || !dtCadastro) {
            return NextResponse.json(
                { error: "Informações em branco." },
                { status: 400 }
            );
        }

         await pool.query(
            `INSERT INTO Aluno (CodUsuario, peso, altura, objetivo, dtCadastro)
            VALUES ($1, $2, $3, $4, $5)`,
            [CodUsuario, peso, altura, objetivo, dtCadastro]
        );

        return NextResponse.json({ message: "Aluno cadastrado com sucesso!" }, { status: 201 })

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

        const result = await pool.query(`SELECT * FROM Aluno ORDER BY CodUsuario ASC;`);
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
            `DELETE FROM Aluno WHERE CodUsuario = $1`,
            [id]
        );

        return NextResponse.json({
            message: "Aluno deletado com sucesso!"
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}