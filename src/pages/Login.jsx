import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";

export default function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    async function handleLogin() {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, senha);
            console.log("Usuário logado:", userCredential.user);
            alert("Login OK");
        } catch (error) {
            console.log("ERRO COMPLETO:", error);
            alert(error.code);
        }
    }

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <Box sx={{ width: 300 }}>
                <Typography variant="h5">Login</Typography>

                <TextField
                    label="Email"
                    fullWidth
                    margin="normal"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                    label="Senha"
                    type="password"
                    fullWidth
                    margin="normal"
                    onChange={(e) => setSenha(e.target.value)}
                />

                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleLogin}
                >
                    Entrar
                </Button>
            </Box>
        </Box>
    );
}