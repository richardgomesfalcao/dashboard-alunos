import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem
} from "@mui/material";

import {
  doc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where
} from "firebase/firestore";

import { db } from "../services/firebase";

export default function AlunoDetalhe() {
  const { id } = useParams();

  const [aluno, setAluno] = useState(null);

  // PAGAMENTO
  const [data, setData] = useState("");
  const [valor, setValor] = useState("");
  const [pagamentos, setPagamentos] = useState([]);

  // AULAS
  const [aulas, setAulas] = useState([]);
  const [conteudo, setConteudo] = useState("");
  const [obs, setObs] = useState("");
  const [presenca, setPresenca] = useState("presente");

  // ===============================
  // VALOR
  // ===============================
  function formatarValorInput(v) {
    v = v.replace(/\D/g, "");
    if (!v) return "";
    return (Number(v) / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2
    });
  }

  function parseValor(v) {
    return Number(v.replace(",", "."));
  }

  // ===============================
  async function buscarAluno() {
    const snap = await getDoc(doc(db, "alunos", id));
    setAluno(snap.data());
  }

  async function buscarPagamentos() {
    const q = query(
      collection(db, "pagamentos"),
      where("alunoId", "==", id)
    );

    const snapshot = await getDocs(q);
    setPagamentos(snapshot.docs.map((doc) => doc.data()));
  }

  async function buscarAulas() {
    const q = query(
      collection(db, "aulas"),
      where("alunoId", "==", id)
    );

    const snapshot = await getDocs(q);
    setAulas(snapshot.docs.map((doc) => doc.data()));
  }

  // ===============================
  async function registrarPagamento() {
    if (!data || !valor) {
      alert("Preencha data e valor");
      return;
    }

    await addDoc(collection(db, "pagamentos"), {
      alunoId: id,
      valor: parseValor(valor),
      data,
      mes: data.slice(0, 7)
    });

    setValor("");
    setData("");

    buscarPagamentos();
  }

  // ===============================
  async function registrarAula() {
    if (!data || !conteudo) {
      alert("Preencha data e conteúdo");
      return;
    }

    await addDoc(collection(db, "aulas"), {
      alunoId: id,
      data,
      conteudo,
      observacao: obs,
      presenca // 👈 NOVO
    });

    setConteudo("");
    setObs("");
    setPresenca("presente");

    buscarAulas();
  }

  // ===============================
  useEffect(() => {
    buscarAluno();
    buscarPagamentos();
    buscarAulas();
  }, []);

  if (!aluno) return <Typography>Carregando...</Typography>;

  // ===============================
  // RESUMO
  // ===============================
  const totalPago = pagamentos.reduce(
    (acc, p) => acc + Number(p.valor),
    0
  );

  // ===============================
  return (
    <Box sx={{ p: 3 }}>

      {/* HEADER */}
      <Typography variant="h4">{aluno.nome}</Typography>

      <Typography sx={{ mt: 1, opacity: 0.7 }}>
        {aluno.dia} • {aluno.hora}
      </Typography>

      {/* RESUMO */}
      <Box sx={{ display: "flex", gap: 2, mt: 3, flexWrap: "wrap" }}>

        <Paper sx={{ p: 2 }}>
          <Typography variant="body2">Total pago</Typography>
          <Typography variant="h6">
            R$ {totalPago.toFixed(2)}
          </Typography>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography variant="body2">Pagamentos</Typography>
          <Typography variant="h6">
            {pagamentos.length}
          </Typography>
        </Paper>

      </Box>

      {/* ===============================
          PAGAMENTO
      =============================== */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6">Registrar pagamento</Typography>

        <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap" }}>

          <TextField
            type="date"
            label="Data"
            InputLabelProps={{ shrink: true }}
            value={data}
            onChange={(e) => setData(e.target.value)}
          />

          <TextField
            label="Valor"
            value={valor}
            onChange={(e) => setValor(formatarValorInput(e.target.value))}
          />

          <Button variant="contained" onClick={registrarPagamento}>
            Registrar
          </Button>

        </Box>
      </Paper>

      {/* ===============================
          AULA
      =============================== */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6">Registrar aula</Typography>

        <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap" }}>

          <TextField
            type="date"
            label="Data"
            InputLabelProps={{ shrink: true }}
            value={data}
            onChange={(e) => setData(e.target.value)}
          />

          <TextField
            label="Conteúdo"
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
          />

          <TextField
            label="Observação"
            value={obs}
            onChange={(e) => setObs(e.target.value)}
          />

          <TextField
            select
            label="Presença"
            value={presenca}
            onChange={(e) => setPresenca(e.target.value)}
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="presente">Presente</MenuItem>
            <MenuItem value="faltou">Faltou</MenuItem>
          </TextField>

          <Button variant="contained" onClick={registrarAula}>
            Registrar aula
          </Button>

        </Box>
      </Paper>

      {/* ===============================
          HISTÓRICO DE AULAS
      =============================== */}
      <Typography variant="h6" sx={{ mt: 4 }}>
        Histórico de aulas
      </Typography>

      <Box sx={{ mt: 2 }}>
        {aulas.length === 0 && (
          <Typography sx={{ opacity: 0.6 }}>
            Nenhuma aula registrada ainda
          </Typography>
        )}

        {[...aulas].reverse().map((aula, i) => (
          <Paper key={i} sx={{ p: 2, mb: 2 }}>

            <Typography>
              {aula.data} • {aula.conteudo}
            </Typography>

            <Typography
              sx={{
                color:
                  aula.presenca === "faltou"
                    ? "#ef4444"
                    : "#22c55e"
              }}
            >
              {aula.presenca === "faltou"
                ? "Faltou"
                : "Presente"}
            </Typography>

            {aula.observacao && (
              <Typography sx={{ opacity: 0.7 }}>
                {aula.observacao}
              </Typography>
            )}

          </Paper>
        ))}
      </Box>

      {/* ===============================
          HISTÓRICO PAGAMENTO
      =============================== */}
      <Typography variant="h6" sx={{ mt: 4 }}>
        Pagamentos
      </Typography>

      <Box sx={{ mt: 2 }}>
        {pagamentos.length === 0 && (
          <Typography sx={{ opacity: 0.6 }}>
            Nenhum pagamento registrado
          </Typography>
        )}

        {[...pagamentos].reverse().map((p, i) => (
          <Paper key={i} sx={{ p: 2, mb: 2 }}>
            <Typography>
              {p.data} • R$ {Number(p.valor).toFixed(2)}
            </Typography>
          </Paper>
        ))}
      </Box>

    </Box>
  );
}