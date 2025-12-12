import { NextResponse } from "next/server";
import pool from "@/lib/db";


export async function POST(requisicao) {

    try {

        const { nome, email } = await requisicao.json();

        if (!nome || !email) {
            return NextResponse.json(
                { error: "Nome e e-mail obrigatórios." },
                { status: 400 }
            );
        }

        //Usamos quando é necessário fazer transações complexas
        //const client = await pool.connect() 

        //caso tenha feito pool.connect, onde tiver pool abaixo, precisamos utilizar o client!
        await pool.query(
            `INSERT INTO clientes (nome, email)
            VALUES ($1, $2)`,
            [nome, email]
        );

        return NextResponse.json({ message: "Cliente inserido com sucesso" }, { status: 201 })

    } catch (error) {

        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function GET() {

    try {

        //Usamos quando é necessário fazer transações complexas
        //const client = await pool.connect()

        //caso tenha feito pool.connect, onde tiver pool abaixo, precisamos utilizar o client!

        const result = await pool.query(`SELECT * FROM cliente ORDER BY id ASC;`);
        return NextResponse.json(result.rows);

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function DELETE(requisicao) {

    try {
        const { searchParams } = new URL(requisicao.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "Informe o ID para deletar." },
                { status: 400 }
            );
        }

        //Usamos quando é necessário fazer transações complexas
        //const client = await pool.connect() 

        //caso tenha feito pool.connect, onde tiver pool abaixo, precisamos utilizar o client!
        await pool.query(
            `DELETE FROM cliente WHERE id = $1`,
            [id]
        );

        return NextResponse.json({
            message: "Cliente deletado com sucesso!",
            cliente: result.rows[0],
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}