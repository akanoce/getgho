import { IconButton } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { FaGhost, FaPause } from 'react-icons/fa6';
import ghostBustersMp3 from '../assets/ghostbusters.mp3';

export const GhostBusters = () => {
    const [play, setPlay] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const player = useRef<HTMLAudioElement>() as any;
    const tooglePlay = () => {
        if (play) {
            player.current?.pause();
        } else {
            player.current?.play();
        }
        setPlay(!play);
    };
    return (
        <>
            <IconButton
                variant={'empty'}
                aria-label="Mode Change"
                size="lg"
                icon={play ? <FaPause /> : <FaGhost />}
                onClick={tooglePlay}
            />
            <audio
                ref={player}
                id={'player-ghostbusters'}
                src={ghostBustersMp3}
            ></audio>
        </>
    );
};
