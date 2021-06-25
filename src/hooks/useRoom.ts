import { useEffect } from "react";
import { useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type firebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<string, {
        authorId: string
    }>
}>

type QuestionType = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likeCount: number;
    likeId: string | undefined;
}



export function useRoom(roomId:string){
    const {user} = useAuth();
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [title, setTitle] = useState('');

    useEffect(()=>{
        const roomRef = database.ref(`rooms/${roomId}`);

        // roomRef.once('value', room => {     //método ONCE : escuta do Firebase, apenas 1 vez
        roomRef.on('value', room => {     //método ONCE : escuta do Firebase todas as vezes que a sala seja alterada
            const databaseRoom = room.val();
            const firebaseQuestions : firebaseQuestions = databaseRoom.questions  ?? {};
            const parsedQuestion = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
                }
            })

            setTitle(databaseRoom.title);
            setQuestions(parsedQuestion);

            return () => {
                roomRef.off('value');
            }
          
        })
    },[roomId, user?.id]);

    return {questions, title}
}