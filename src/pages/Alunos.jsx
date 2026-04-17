// Importação de hooks do React
import { useEffect, useState } from "react";

// Componentes do Material UI (interface)
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper
} from "@mui/material";

// Funções do Firebase Firestore
import {
  collection,     
  addDoc,         
  getDocs,        
  deleteDoc,      
  doc,            
  updateDoc       
} from "firebase/firestore";

// Conexão com banco
import { db } from "../services/firebase";

export default function Alunos() {
  // Estado para armazenar nome digitado no input
  const [nome, setNome] = useState("");

  // Estado que guarda a lista de alunos vinda do banco
  const [alunos, setAlunos] = useState([]);

  // Estado para saber se estamos editando um aluno
  // Se for null → estou adicionando
  // Se tiver um id → estou editando
  const [editandoId, setEditandoId] = useState(null);

  // ===============================
  // BUSCAR ALUNOS (READ)
  // ===============================
  async function buscarAlunos() {
    // Busca todos os documentos da coleção "alunos"
    const querySnapshot = await getDocs(collection(db, "alunos"));

    // Array para armazenar os dados formatados
    const lista = [];

    // Percorre todos os documentos retornados
    querySnapshot.forEach((docItem) => {
      lista.push({
        id: docItem.id,        
        ...docItem.data()      
      });
    });

    // Atualiza estado com lista completa
    setAlunos(lista);
  }

  // ===============================
  // ADICIONAR ALUNO (CREATE)
  // ===============================
  async function adicionarAluno() {
    
    await addDoc(collection(db, "alunos"), {
      nome: nome,
      createdAt: new Date()
    });

    // Limpa input
    setNome("");

    // Atualiza lista
    buscarAlunos();
  }

  // ===============================
  // DELETAR ALUNO (DELETE)
  // ===============================
  async function deletarAluno(id) {
    await deleteDoc(doc(db, "alunos", id));
    buscarAlunos();
  }

  // ===============================
  // EDITAR ALUNO (UPDATE)
  // ===============================
  async function editarAluno(id) {
    // Atualiza documento pelo id
    await updateDoc(doc(db, "alunos", id), {
      nome: nome
    });

    // Limpa input
    setNome("");

    // Sai do modo edição
    setEditandoId(null);

    // Atualiza lista
    buscarAlunos();
  }

  // ===============================
  // CARREGAMENTO INICIAL
  // ===============================
  useEffect(() => {
    // Quando a página carregar, busca os alunos
    buscarAlunos();
  }, []);

  // ===============================
  // RENDERIZAÇÃO
  // ===============================
  return (
    <Box sx={{ flex: 1, padding: 3 }}>
      
      {/* Título da página */}
      <Typography variant="h4">Alunos</Typography>

      {/* Formulário (input + botão) */}
      <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
        
        {/* Campo para digitar nome */}
        <TextField
          label="Nome do aluno"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        {/* Botão muda comportamento:
            - Se estiver editando → salva edição
            - Se não → adiciona novo aluno
        */}
        <Button
          variant="contained"
          onClick={() => {
            if (editandoId) {
              editarAluno(editandoId);
            } else {
              adicionarAluno();
            }
          }}
        >
          {editandoId ? "Salvar" : "Adicionar"}
        </Button>
      </Box>

      {/* Lista de alunos */}
      <Box sx={{ marginTop: 4 }}>
        {alunos.map((aluno) => (
          
          <Paper
            key={aluno.id}
            sx={{
              padding: 2,
              marginBottom: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            
            {/* Nome do aluno */}
            <span>{aluno.nome}</span>

            {/* Botões de ação */}
            <Box sx={{ display: "flex", gap: 1 }}>
              
              {/* Botão editar:
                  - Coloca nome no input
                  - Ativa modo edição
              */}
              <Button
                onClick={() => {
                  setNome(aluno.nome);
                  setEditandoId(aluno.id);
                }}
              >
                Editar
              </Button>

              {/* Botão excluir */}
              <Button
                color="error"
                onClick={() => deletarAluno(aluno.id)}
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