import { getEmail, isAdmin, getRole } from "../services/authService";

function HomePage() {
    const email = getEmail();
    const admin = isAdmin();
    const role = getRole();

    return (
        <div>
            <h2>Welcome {role}</h2>
            <p>Logged in as: <b>{email}</b></p>
            {admin && <button>Admin Panel</button>}
        </div>
    );
}

export default HomePage;
