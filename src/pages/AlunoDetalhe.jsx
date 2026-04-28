import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
    Box,
    Typography,
    Paper,
    CircularProgress
} from "@mui/material";

import {
    collection,
    addDoc,
    getDocs,
    query,
    where
} from "firebase/firestore";

import {
    TextField,
    Button,
    Checkbox,
    FormControlLabel
} from "@mui/material";

import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";

export default function AlunoDetalhe() {
    const { id } = useParams();
    const [aulas, setAulas] = useState([]);

    const [data, setData] = useState("");
    const [conteudo, setConteudo] = useState("");
    const [obs, setObs] = useState("");
    const [presenca, setPresenca] = useState(true);

    const [aluno, setAluno] = useState(null);
    const [loading, setLoading] = useState(true);

    async function buscarAulas() {
        const q = query(
            collection(db, "aulas"),
            where("alunoId", "==", id)
        );

        const querySnapshot = await getDocs(q);

        const lista = [];

        querySnapshot.forEach((doc) => {
            lista.push({
                id: doc.id,
                ...doc.data()
            });
        });

        setAulas(lista);
    }

    async function adicionarAula() {
        await addDoc(collection(db, "aulas"), {
            alunoId: id,
            data,
            conteudo,
            obs,
            presenca
        });

        setData("");
        setConteudo("");
        setObs("");
        setPresenca(true);

        buscarAulas();
    }

    async function buscarAluno() {
        try {
            const docRef = doc(db, "alunos", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setAluno(docSnap.data());
            } else {
                setAluno(null);
            }
        } catch (error) {
            console.log(error);
        }

        setLoading(false);
    }

    useEffect(() => {
        buscarAluno();
        buscarAulas();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!aluno) {
        return <Typography>Aluno não encontrado</Typography>;
    }

    return (
        <Box sx={{ flex: 1, padding: 3 }}>
            <Typography variant="h4">{aluno.nome}</Typography>

            <Paper sx={{ p: 2, mt: 3 }}>
                <Typography>Dia: {aluno.dia}</Typography>
                <Typography>Hora: {aluno.hora}</Typography>
                <Typography>Valor: R$ {aluno.valor}</Typography>
            </Paper>

            {/* área do diário */}
            <Paper sx={{ p: 2, mt: 3 }}>
                <Typography variant="h6">Nova Aula</Typography>

                <TextField
                    label="Data"
                    fullWidth
                    sx={{ mt: 2 }}
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                />

                <TextField
                    label="Conteúdo"
                    fullWidth
                    sx={{ mt: 2 }}
                    value={conteudo}
                    onChange={(e) => setConteudo(e.target.value)}
                />

                <TextField
                    label="Observações"
                    fullWidth
                    sx={{ mt: 2 }}
                    value={obs}
                    onChange={(e) => setObs(e.target.value)}
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={presenca}
                            onChange={(e) => setPresenca(e.target.checked)}
                        />
                    }
                    label="Presente"
                />

                <Button variant="contained" onClick={adicionarAula}>
                    Salvar Aula
                </Button>
            </Paper>

            
            <Paper sx={{ p: 2, mt: 3 }}>
                <Typography variant="h6">Histórico de Aulas</Typography>

                {aulas.length === 0 && (
                    <Typography sx={{ mt: 2 }}>
                        Nenhuma aula registrada
                    </Typography>
                )}

                {aulas.map((aula) => (
                    <Box
                        key={aula.id}
                        sx={{
                            mt: 2,
                            p: 2,
                            border: "1px solid #ccc",
                            borderRadius: 2
                        }}
                    >
                        <Typography><b>Data:</b> {aula.data}</Typography>
                        <Typography><b>Conteúdo:</b> {aula.conteudo}</Typography>
                        <Typography><b>Obs:</b> {aula.obs}</Typography>
                        <Typography>
                            <b>Presença:</b> {aula.presenca ? "Presente" : "Faltou"}
                        </Typography>
                    </Box>
                ))}
            </Paper>
        </Box>
    );
}