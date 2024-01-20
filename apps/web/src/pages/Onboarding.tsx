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
    Box
} from '@chakra-ui/react';
import { ChangeEvent, useState } from 'react';
import { FaArrowLeft, FaCheck, FaKey } from 'react-icons/fa6';
import ghost from '../assets/ghost.png';

type Props = {
    login: () => void;
    signup: (walletName: string) => Promise<void>;
};

type Steps = 'main' | 'alreadyHaveWallet' | 'createWallet' | 'connectWallet';

const OnboardingBody = ({ login, signup }: Props) => {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const [step, setStep] = useState<Steps>('main');

    if (step === 'alreadyHaveWallet') {
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
                    <ConnectKitButton.Custom>
                        {({ isConnected, show, address }) => {
                            return (
                                <Button
                                    colorScheme="black"
                                    variant={'outline'}
                                    size={'lg'}
                                    onClick={show}
                                >
                                    {isConnected ? address : 'Connect Wallet'}
                                </Button>
                            );
                        }}
                    </ConnectKitButton.Custom>
                </HStack>
            </HStack>
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
                    borderColor={'black'}
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
        <>
            <VStack mb={70}>
                <HStack>
                    <Image src={ghost} w={100} />
                    <VStack alignItems={'flex-start'}>
                        <Heading fontSize={30}>GetGho</Heading>
                        <Text fontSize={13}>
                            Owning Gho is never been so easy
                        </Text>
                    </VStack>
                </HStack>
            </VStack>
            <Box minH={300}>
                <OnboardingBody login={login} signup={signup} />
            </Box>
        </>
    );
};
