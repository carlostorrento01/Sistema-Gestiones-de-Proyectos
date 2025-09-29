import { NextResponse } from "next/server";
import { getProjects, createProject } from "../../../lib/db";

export async function GET() {
  return NextResponse.json(getProjects());
}

export async function POST(req) {
  const body = await req.json();
  if (!body.name) return NextResponse.json({ error: "name requerido" }, { status: 400 });
  const created = createProject({
    name: body.name,
    description: body.description || "",
    owner: body.owner || "desconocido",
  });
  return NextResponse.json(created, { status: 201 });
}
