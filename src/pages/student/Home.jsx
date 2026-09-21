import { useAuth } from '../../hooks/useAuth';
import { RoleHome } from '../shared/RoleHome';
export function Home() { const { user, logout } = useAuth(); return <RoleHome title="Área do estudante" user={user} logout={logout} />; }
