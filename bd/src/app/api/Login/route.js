import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(requisicao) {

    try {

        const { CodLogin, senha } = await requisicao.json();

        if (!CodLogin || !senha) {
            return NextResponse.json(
                { error: "Informações em branco." },
                { status: 400 }
            );
        }

        const senhaHash = await bcrypt.hash(senha, 10);

         await pool.query(
            `INSERT INTO Login (CodLogin, senha)
            VALUES ($1, $2)`,
            [CodLogin, senhaHash]
        );

        return NextResponse.json({ message: "Usuário cadastrado com sucesso!" }, { status: 201 })

    } catch (error) {
        if (error.code === "23505") {
            return NextResponse.json(
            { error: "CodLogin já existe." },
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

        const result = await pool.query(`SELECT CodLogin FROM Login ORDER BY CodLogin ASC;`);
        return NextResponse.json(result.rows);

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function DELETE(requisicao) {

    try {
        const { searchParams } = new URL(requisicao.url);
        const id = searchParams.get("CodLogin");

        if (!id) {
            return NextResponse.json(
                { error: "Informe o CodLogin para deletar." },
                { status: 400 }
            );
        }

            await pool.query(
            `DELETE FROM Login WHERE CodLogin = $1`,
            [id]
        );

        return NextResponse.json({
            message: "Login deletado com sucesso!"
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}