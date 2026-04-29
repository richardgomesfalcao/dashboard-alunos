import { useEffect, useState } from "react";
import { Box, Typography, Paper } from "@mui/material";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

import Topbar from "../components/Topbar";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Dashboard() {
  const [totalAlunos, setTotalAlunos] = useState(0);
  const [receita, setReceita] = useState(0);
  const [inadimplentes, setInadimplentes] = useState(0);
  const [pagamentos, setPagamentos] = useState([]);

  async function carregarDados() {
    const alunosSnap = await getDocs(collection(db, "alunos"));
    const pagamentosSnap = await getDocs(collection(db, "pagamentos"));

    const alunos = [];
    alunosSnap.forEach((doc) =>
      alunos.push({ id: doc.id, ...doc.data() })
    );

    const pagamentosLista = [];
    pagamentosSnap.forEach((doc) =>
      pagamentosLista.push(doc.data())
    );

    setPagamentos(pagamentosLista);
    setTotalAlunos(alunos.length);

    const mesAtual = new Date().toISOString().slice(0, 7);

    const pagamentosMes = pagamentosLista.filter(
      (p) => p.mes === mesAtual
    );

    const receitaTotal = pagamentosMes.reduce(
      (acc, p) => acc + Number(p.valor || 0),
      0
    );

    setReceita(receitaTotal);

    const alunosPagaramIds = pagamentosMes.map((p) => p.alunoId);

    const inadimplentesLista = alunos.filter(
      (a) => !alunosPagaramIds.includes(a.id)
    );

    setInadimplentes(inadimplentesLista.length);
  }

  useEffect(() => {
    carregarDados();
  }, []);

  // AGRUPAR POR MÊS
  const agrupado = {};
  pagamentos.forEach((p) => {
    if (!agrupado[p.mes]) agrupado[p.mes] = 0;
    agrupado[p.mes] += Number(p.valor || 0);
  });

  const dataGrafico = Object.keys(agrupado).map((mes) => ({
    mes,
    valor: agrupado[mes],
  }));

  return (
    <Box>
      <Topbar />

      {/* CARDS */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Paper sx={{
          p: 3,
          width: 240,
          background: "linear-gradient(135deg, #7c4dff, #6366f1)",
          boxShadow: "0 10px 30px rgba(124,77,255,0.3)"
        }}>
          <Typography>Alunos</Typography>
          <Typography variant="h4">{totalAlunos}</Typography>
        </Paper>

        <Paper sx={{
          p: 3,
          width: 240,
          background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
          boxShadow: "0 10px 30px rgba(6,182,212,0.3)"
        }}>
          <Typography>Receita</Typography>
          <Typography variant="h4">R$ {receita}</Typography>
        </Paper>

        <Paper sx={{
          p: 3,
          width: 240,
          background: "linear-gradient(135deg, #f43f5e, #ef4444)",
          boxShadow: "0 10px 30px rgba(244,63,94,0.3)"
        }}>
          <Typography>Inadimplentes</Typography>
          <Typography variant="h4">{inadimplentes}</Typography>
        </Paper>
      </Box>

      {/* GRÁFICO */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h6">Receita por mês</Typography>

        <Paper sx={{
          p: 3,
          mt: 2,
          background: "rgba(15,23,42,0.7)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.05)"
        }}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dataGrafico}>
              <defs>
                <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c4dff" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#7c4dff" stopOpacity={0}/>
                </linearGradient>
              </defs>

              <XAxis dataKey="mes" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "none",
                  borderRadius: 8
                }}
              />

              <Area
                type="monotone"
                dataKey="valor"
                stroke="#7c4dff"
                fillOpacity={1}
                fill="url(#colorValor)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Paper>
      </Box>
    </Box>
  );
}