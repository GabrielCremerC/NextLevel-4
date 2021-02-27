import { Children, createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ChallengesContext } from "./ChallengesContext";

interface CountdownContextData{
    minutes: number;
    seconds: number;
    hasFinished: boolean;
    isActive: boolean;
    startCountdown: () => void;
    resetCounterdown: () => void;
}

interface CountdownProviderProps{
    children: ReactNode;
}

let countdownTimeOut : NodeJS.Timeout;


export const CountdownContext = createContext({} as CountdownContextData);

export function CountdownProvider({children}){
    const { startNewChallenge } = useContext(ChallengesContext);


    const [ time, setTime ] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [hasFinished, setHasFinished] = useState(false); 

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    function startCountdown(){
        setIsActive(true);
    }
    
    function resetCounterdown(){
        clearTimeout(countdownTimeOut);
        setIsActive(false);
        setHasFinished(false);
        setTime(25 * 60);

    }


    useEffect(() => {
        if(isActive && time > 0){
            countdownTimeOut = setTimeout(() => {
                setTime(time - 1);
            }, 1000)
        } else if(isActive && time === 0){
            setHasFinished(true);
            setIsActive(false);
            startNewChallenge();
        }
    },[isActive, time])

    return(
        <CountdownContext.Provider value={{
            minutes,
            seconds,
            hasFinished,
            isActive,
            startCountdown,
            resetCounterdown,
        }}>
            {children}
        </CountdownContext.Provider>
    )
}