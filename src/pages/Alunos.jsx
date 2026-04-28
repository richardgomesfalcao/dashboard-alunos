import { useEffect, useState } from "react";

import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";

import { db } from "../services/firebase";
import { useNavigate } from "react-router-dom";

export default function Alunos() {
  const navigate = useNavigate();

  // Estados principais
  const [nome, setNome] = useState("");
  const [dia, setDia] = useState("");
  const [hora, setHora] = useState("");
  const [valor, setValor] = useState("");

  const [alunos, setAlunos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  // UX
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  // ===============================
  // READ
  // ===============================
  async function buscarAlunos() {
    setLoading(true);

    try {
      const querySnapshot = await getDocs(collection(db, "alunos"));

      const lista = [];

      querySnapshot.forEach((docItem) => {
        lista.push({
          id: docItem.id,
          ...docItem.data()
        });
      });

      setAlunos(lista);
    } catch (error) {
      setErro("Erro ao buscar alunos");
    }

    setLoading(false);
  }

  // ===============================
  // CREATE
  // ===============================
  async function adicionarAluno() {
    try {
      await addDoc(collection(db, "alunos"), {
        nome,
        dia,
        hora,
        valor,
        createdAt: new Date()
      });

      setMensagem("Aluno adicionado com sucesso");

      setNome("");
      setDia("");
      setHora("");
      setValor("");

      buscarAlunos();
    } catch {
      setErro("Erro ao adicionar aluno");
    }
  }

  // ===============================
  // DELETE
  // ===============================
  async function deletarAluno(id) {
    await deleteDoc(doc(db, "alunos", id));
    setMensagem("Aluno removido");
    buscarAlunos();
  }

  // ===============================
  // UPDATE
  // ===============================
  async function editarAluno(id) {
    await updateDoc(doc(db, "alunos", id), {
      nome,
      dia,
      hora,
      valor
    });

    setMensagem("Aluno atualizado");

    setNome("");
    setDia("");
    setHora("");
    setValor("");

    setEditandoId(null);
    buscarAlunos();
  }

  // ===============================
  // INIT
  // ===============================
  useEffect(() => {
    buscarAlunos();
  }, []);

  // ===============================
  // BUSCA
  // ===============================
  const alunosFiltrados = alunos.filter((aluno) =>
    aluno.nome.toLowerCase().includes(busca.toLowerCase())
  );

  // ===============================
  // UI
  // ===============================
  return (
    <Box sx={{ flex: 1, padding: 3 }}>
      <Typography variant="h4">Alunos</Typography>

      {/* Feedback */}
      <Snackbar
        open={!!mensagem}
        autoHideDuration={3000}
        onClose={() => setMensagem("")}
      >
        <Alert severity="success">{mensagem}</Alert>
      </Snackbar>

      <Snackbar
        open={!!erro}
        autoHideDuration={3000}
        onClose={() => setErro("")}
      >
        <Alert severity="error">{erro}</Alert>
      </Snackbar>

      {/* Form */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mt: 2,
          flexWrap: "wrap"
        }}
      >
        <TextField
          fullWidth
          label="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <TextField
          fullWidth
          label="Dia"
          value={dia}
          onChange={(e) => setDia(e.target.value)}
        />

        <TextField
          fullWidth
          label="Hora"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
        />

        <TextField
          fullWidth
          label="Valor"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={() => {
            if (editandoId) editarAluno(editandoId);
            else adicionarAluno();
          }}
        >
          {editandoId ? "Salvar" : "Adicionar"}
        </Button>
      </Box>

      {/* Busca */}
      <TextField
        label="Buscar aluno"
        fullWidth
        sx={{ mt: 3 }}
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      {/* Loading */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Lista */}
      <Box sx={{ mt: 3 }}>
        {!loading && alunosFiltrados.length === 0 && (
          <Box sx={{ textAlign: "center", mt: 5 }}>
            <Typography variant="h6">
              Nenhum aluno cadastrado ainda
            </Typography>
            <Typography variant="body2">
              Comece adicionando seu primeiro aluno
            </Typography>
          </Box>
        )}

        {alunosFiltrados.map((aluno) => (
          <Paper
            key={aluno.id}
            onClick={() => navigate(`/alunos/${aluno.id}`)}
            sx={{
              cursor: "pointer",
              p: 2,
              mb: 2,
              display: "flex",
              justifyContent: "space-between",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2
            }}
          >
            <Box>
              <Typography fontWeight="bold">{aluno.nome}</Typography>
              <Typography variant="body2">
                {aluno.dia} • {aluno.hora} • R$ {aluno.valor}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setNome(aluno.nome);
                  setDia(aluno.dia);
                  setHora(aluno.hora);
                  setValor(aluno.valor);
                  setEditandoId(aluno.id);
                }}
              >
                Editar
              </Button>

              <Button
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  deletarAluno(aluno.id);
                }}
              >
                Excluir
              </Button>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}