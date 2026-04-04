import { useState } from "react";
import axios from "axios";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const res = await axios.post("http://localhost:3001/api/login", {
        email,
        password,
        });

        console.log(res.data);

        localStorage.setItem("token", res.data.token);
        window.location.href = "/dashboard";
        alert("Login successful");

    } catch (err) {
        console.error(err);
        alert("Login failed");
    }
    };

    return (
    <div>
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
        <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <button type="submit">Login</button>
        </form>
    </div>
    );
}

export default Login;