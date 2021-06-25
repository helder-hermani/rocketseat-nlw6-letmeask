import {FormEvent, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {Link} from 'react-router-dom';
import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import {Button} from '../components/Button';
import '../styles/auth.scss';
import { database } from '../services/firebase';
import {useAuth} from '../hooks/useAuth';


export function NewRoom(){

    const history = useHistory();
    const { user } = useAuth();
    const [newRoom, setNewRoom] = useState("");

    async function handleCreateRoom(e:FormEvent){
        e.preventDefault();
        console.log(newRoom);

        if (newRoom.trim()===""){
            return;
        }

        const roomRef = database.ref("rooms");

        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id
        })

        history.push(`/rooms/${firebaseRoom.key}`);
    }

    return(
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas"/>
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Let Me Ask" />
                    {/* <h1>{user?.name}</h1> */}
                    <h2>Crie uma nova sala</h2>
                    <form onSubmit={(e)=>handleCreateRoom(e)}>
                        <input 
                            type="text"
                            placeholder="Nome da Sala"
                            onChange={(e)=>setNewRoom(e.target.value)}
                            value={newRoom}
                        />
                        <Button type="submit">
                            Criar Sala
                        </Button>
                    </form>
                    <p>Quer entrar e uma sala existente? <Link to="/">Clique aqui</Link></p>
                </div>
            </main>
        </div>
    )
}