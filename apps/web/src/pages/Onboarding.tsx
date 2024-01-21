import { ConnectKitButton } from 'connectkit';
import {
    Button,
    Input,
    VStack,
    Icon,
    HStack,
    Heading,
    IconButton,
    Image,
    Text,
    Box,
    useColorModeValue,
    Spinner
} from '@chakra-ui/react';
import { ChangeEvent, useEffect, useState } from 'react';
import { FaArrowLeft, FaCheck, FaKey } from 'react-icons/fa6';
import ghost from '../assets/ghost.png';
import {
    WalletCreationStep,
    useAuth,
    useWalletCreationStep
} from '@repo/lfgho-sdk';
import Lottie from 'react-lottie';
import ghostAnimation from '../assets/ghost-lottie.json';
import { motion } from 'framer-motion';

// Animation variants
const leftToRight = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
};

const bottomToUp = {
    initial: { opacity: 0, y: 50 }, // Start from below
    animate: { opacity: 1, y: 0 }, // Animate to original position
    exit: { opacity: 0, y: -50 } // Exit to above
};

type Steps = 'main' | 'alreadyHaveWallet' | 'createWallet' | 'connectWallet';

const Loading = ({ text }: { text: string }) => {
    return (
        <HStack spacing={4}>
            <Text>{text}</Text>
            <Spinner />
        </HStack>
    );
};

const OnboardingBody = () => {
    const { signup, login } = useAuth();
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };
    const { walletCreationStep } = useWalletCreationStep();
    const [step, setStep] = useState<Steps>('main');
    const borderColor = useColorModeValue('black', 'white');

    const [showGhost, setShowGhost] = useState(false);

    useEffect(() => {
        const l1 = (e: KeyboardEvent) => {
            if (step === 'createWallet' && e.code === 'Enter' && inputValue) {
                signup(`LFGHO - ${inputValue}`);
            }
        };
        window.addEventListener('keydown', l1);

        const l2 = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                setShowGhost(true);
            }
        };
        window.addEventListener('keydown', l2);
        const l3 = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                setShowGhost(false);
            }
        };
        window.addEventListener('keyup', l3);
        return () => {
            window.removeEventListener('keydown', l1);
            window.removeEventListener('keydown', l2);
            window.removeEventListener('keyup', l3);
        };
    });

    if (walletCreationStep === WalletCreationStep.LoadingWallet) {
        return <Loading text={'Loading wallet...'} />;
    }

    if (walletCreationStep === WalletCreationStep.CreatingWallet) {
        return <Loading text={'Creating wallet...'} />;
    }

    if (walletCreationStep === WalletCreationStep.RequestingSignature) {
        return <Loading text={'Requesting signature...'} />;
    }

    if (walletCreationStep === WalletCreationStep.DeployingWallet) {
        return (
            <VStack spacing={4}>
                <VStack spacing={4}>
                    <Loading text={'Deploying the smart wallet...'} />
                    <Text>
                        someone is waiting with you... hold{' '}
                        <strong>'space' </strong> to reveal
                    </Text>
                </VStack>
                <div style={{ height: '200px', position: 'relative' }}> {/* Set a fixed height */}
                <Lottie
                    style={{
                        position: 'absolute',
                        pointerEvents: 'none',
                        opacity: showGhost ? 1 : 0,
                        transition: 'opacity 0.5s ease-in-out'
                    }}
                    options={{
                        loop: true,
                        autoplay: true,
                        animationData: ghostAnimation
                    }}
                    height={200}
                    width={200}
                />
                </div>
            </VStack>
        );
    }

    if (step === 'alreadyHaveWallet') {
        return (
            <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={leftToRight}
                transition={{ duration: 0.5 }}
            >
                <ConnectKitButton.Custom>
                    {({ isConnected, isConnecting, show, address }) => {
                        if (isConnecting) {
                            return <Loading text={'Loading wallet...'} />;
                        }
                        return (
                            <HStack>
                                <IconButton
                                    size="sm"
                                    aria-label="Go back"
                                    variant={'ghost'}
                                    icon={<Icon as={FaArrowLeft} />}
                                    onClick={() => setStep('main')}
                                />
                                <HStack spacing={4}>
                                    <Button
                                        colorScheme="black"
                                        variant={'outline'}
                                        size={'lg'}
                                        onClick={login}
                                        leftIcon={<Icon as={FaKey} />}
                                    >
                                        Passkey
                                    </Button>
                                    <Text>or</Text>

                                    <Button
                                        colorScheme="black"
                                        variant={'outline'}
                                        size={'lg'}
                                        onClick={show}
                                    >
                                        {isConnected
                                            ? address
                                            : 'Connect Wallet'}
                                    </Button>
                                </HStack>
                            </HStack>
                        );
                    }}
                </ConnectKitButton.Custom>
            </motion.div>
        );
    }

    if (step === 'createWallet') {
        return (
            <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={leftToRight}
                transition={{ duration: 0.5 }}
            >
                <HStack>
                    <IconButton
                        size="sm"
                        aria-label="Go back"
                        variant={'ghost'}
                        icon={<Icon as={FaArrowLeft} />}
                        onClick={() => setStep('main')}
                    />
                    <Input
                        variant="outline"
                        type="text"
                        placeholder="Wallet name ..."
                        onChange={handleInputChange}
                        value={inputValue}
                        borderColor={borderColor}
                        _placeholder={{ color: borderColor, opacity: 0.5 }}
                        _hover={{ borderColor: { borderColor } }}
                    />
                    <IconButton
                        size="sm"
                        variant={'ghost'}
                        aria-label="Confirm"
                        colorScheme="green"
                        icon={<Icon as={FaCheck} />}
                        isDisabled={!inputValue}
                        onClick={() => signup(`LFGHO - ${inputValue}`)}
                    />
                </HStack>
            </motion.div>
        );
    }

    return (
        <VStack spacing={4}>
            <Button
                colorScheme="black"
                variant={'outline'}
                size={'lg'}
                onClick={() => setStep('createWallet')}
            >
                Create wallet
            </Button>
            <Button
                variant={'link'}
                colorScheme="black"
                onClick={() => setStep('alreadyHaveWallet')}
            >
                Already have a wallet?
            </Button>
        </VStack>
    );
};

export const Onboarding = () => {
    return (
        <VStack spacing={70}>
            <VStack>
                <HStack>
                    <Image src={ghost} w={100} />
                    <VStack alignItems={'flex-start'}>
                        <Heading fontSize={30}>GetGho</Heading>
                        <Text fontSize={13}>
                            Owning Gho has never been so easy
                        </Text>
                    </VStack>
                </HStack>
            </VStack>
            <Box minH={100}>
                <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={bottomToUp}
                    transition={{ duration: 0.5 }}
                >
                    <OnboardingBody />
                </motion.div>
            </Box>
        </VStack>
    );
};
