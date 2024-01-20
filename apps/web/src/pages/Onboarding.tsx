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
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { FaArrowLeft, FaCheck, FaKey } from 'react-icons/fa6';
import ghost from '../assets/ghost.png';
import { WalletCreationStep, useWalletCreationStep } from '@repo/lfgho-sdk';
import Lottie from 'react-lottie';
import ghostAnimation from '../assets/ghost-lottie.json';

type Props = {
    login: () => void;
    signup: (walletName: string) => Promise<void>;
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

const OnboardingBody = ({ login, signup }: Props) => {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };
    const { walletCreationStep } = useWalletCreationStep();
    const [step, setStep] = useState<Steps>('main');
    const borderColor = useColorModeValue('black', 'white');

    const [showGhost, setShowGhost] = useState(false);

    useEffect(() => {
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                setShowGhost(true);
            }
        });
        window.addEventListener('keyup', (e) => {
            if (e.code === 'Space') {
                setShowGhost(false);
            }
        });
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
            </VStack>
        );
    }

    if (step === 'alreadyHaveWallet') {
        return (
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
                                    {isConnected ? address : 'Connect Wallet'}
                                </Button>
                            </HStack>
                        </HStack>
                    );
                }}
            </ConnectKitButton.Custom>
        );
    }

    if (step === 'createWallet') {
        return (
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

export const Onboarding = ({ login, signup }: Props) => {
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
                <OnboardingBody login={login} signup={signup} />
            </Box>
        </VStack>
    );
};
