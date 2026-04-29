import { useEffect, useState } from "react";

import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";

import {
  LocalizationProvider,
  TimePicker
} from "@mui/x-date-pickers";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

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

  // ===============================
  // STATES
  // ===============================
  const [nome, setNome] = useState("");
  const [dia, setDia] = useState("");
  const [hora, setHora] = useState(null);
  const [valor, setValor] = useState("");

  const [alunos, setAlunos] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [alunoParaDeletar, setAlunoParaDeletar] = useState(null);

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

  function formatarValorDisplay(v) {
    return Number(v).toLocaleString("pt-BR", {
      minimumFractionDigits: 2
    });
  }

  // ===============================
  // FIREBASE
  // ===============================
  async function buscarAlunos() {
    const snapshot = await getDocs(collection(db, "alunos"));

    const lista = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    setAlunos(lista);
  }

  async function adicionarAluno() {
    if (!nome || !dia || !hora || !valor) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      await addDoc(collection(db, "alunos"), {
        nome,
        dia,
        hora: hora.format("HH:mm"),
        valor: parseValor(valor)
      });

      setNome("");
      setDia("");
      setHora(null);
      setValor("");

      buscarAlunos();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar");
    }
  }

  async function salvarEdicao() {
    await updateDoc(doc(db, "alunos", editando.id), {
      nome: editando.nome,
      dia: editando.dia,
      hora: editando.hora ? editando.hora.format("HH:mm") : "",
      valor: parseValor(editando.valor)
    });

    setModalOpen(false);
    buscarAlunos();
  }

  async function deletarAluno(id) {
    await deleteDoc(doc(db, "alunos", id));
    buscarAlunos();
  }

  // ===============================
  useEffect(() => {
    buscarAlunos();
  }, []);

  // ===============================
  // RENDER
  // ===============================
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3 }}>

        <Typography variant="h4">Alunos</Typography>

        {/* FORM */}
        <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap" }}>

          <TextField
            label="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Dia</InputLabel>
            <Select value={dia} label="Dia" onChange={(e) => setDia(e.target.value)}>
              <MenuItem value="Segunda">Segunda</MenuItem>
              <MenuItem value="Terça">Terça</MenuItem>
              <MenuItem value="Quarta">Quarta</MenuItem>
              <MenuItem value="Quinta">Quinta</MenuItem>
              <MenuItem value="Sexta">Sexta</MenuItem>
              <MenuItem value="Sábado">Sábado</MenuItem>
              <MenuItem value="Domingo">Domingo</MenuItem>
            </Select>
          </FormControl>

          <TimePicker
            label="Hora"
            value={hora}
            onChange={(newValue) => setHora(newValue)}
          />

          <TextField
            label="Valor"
            value={valor}
            onChange={(e) => setValor(formatarValorInput(e.target.value))}
          />

        </Box>

        <Button
          sx={{ mt: 3 }}
          variant="contained"
          fullWidth
          onClick={adicionarAluno}
        >
          Adicionar
        </Button>

        {/* LISTA */}
        <Box sx={{ mt: 3 }}>
          {alunos.map((aluno) => (
            <Paper
              key={aluno.id}
              sx={{
                p: 2,
                mb: 2,
                display: "flex",
                justifyContent: "space-between"
              }}
            >
              <Box
                onClick={() => navigate(`/alunos/${aluno.id}`)}
                sx={{ cursor: "pointer" }}
              >
                <Typography>{aluno.nome}</Typography>

                <Typography>
                  {aluno.dia} • {aluno.hora} • R$ {formatarValorDisplay(aluno.valor)}
                </Typography>
              </Box>

              <Box>

                <Button
                  onClick={() => {
                    setEditando({
                      ...aluno,
                      valor: formatarValorDisplay(aluno.valor),
                      hora: aluno.hora
                        ? dayjs(`2024-01-01T${aluno.hora}`)
                        : null
                    });
                    setModalOpen(true);
                  }}
                >
                  Editar
                </Button>

                <Button
                  color="error"
                  onClick={() => {
                    setAlunoParaDeletar(aluno.id);
                    setConfirmOpen(true);
                  }}
                >
                  Excluir
                </Button>

              </Box>
            </Paper>
          ))}
        </Box>

        {/* MODAL EDITAR */}
        <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth>
          <DialogTitle>Editar aluno</DialogTitle>

          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>

            <TextField
              label="Nome"
              value={editando?.nome || ""}
              onChange={(e) =>
                setEditando({ ...editando, nome: e.target.value })
              }
            />

            <FormControl>
              <InputLabel>Dia</InputLabel>
              <Select
                value={editando?.dia || ""}
                label="Dia"
                onChange={(e) =>
                  setEditando({ ...editando, dia: e.target.value })
                }
              >
                <MenuItem value="Segunda">Segunda</MenuItem>
                <MenuItem value="Terça">Terça</MenuItem>
                <MenuItem value="Quarta">Quarta</MenuItem>
                <MenuItem value="Quinta">Quinta</MenuItem>
                <MenuItem value="Sexta">Sexta</MenuItem>
                <MenuItem value="Sábado">Sábado</MenuItem>
                <MenuItem value="Domingo">Domingo</MenuItem>
              </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                label="Hora"
                value={editando?.hora || null}
                onChange={(newValue) =>
                  setEditando({ ...editando, hora: newValue })
                }
              />
            </LocalizationProvider>

            <TextField
              label="Valor"
              value={editando?.valor || ""}
              onChange={(e) =>
                setEditando({
                  ...editando,
                  valor: formatarValorInput(e.target.value)
                })
              }
            />

          </DialogContent>

          <DialogActions>
            <Button onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>

            <Button variant="contained" onClick={salvarEdicao}>
              Salvar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>

          <DialogTitle sx={{ fontWeight: "bold" }}>
            Confirmar exclusão
          </DialogTitle>

          <DialogContent>
            <Typography>
              Tem certeza que deseja excluir este aluno?
            </Typography>
          </DialogContent>

          <DialogActions sx={{ pb: 2, pr: 3 }}>

            <Button
              onClick={() => setConfirmOpen(false)}
              sx={{ color: "#aaa" }}
            >
              Cancelar
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={async () => {
                await deletarAluno(alunoParaDeletar);
                setConfirmOpen(false);
              }}
              sx={{
                borderRadius: 2,
                fontWeight: "bold"
              }}
            >
              Excluir
            </Button>

          </DialogActions>

        </Dialog>

      </Box>
    </LocalizationProvider>

  );
}