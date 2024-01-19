import { ConnectKitButton } from 'connectkit';
import {
    Card,
    CardBody,
    Button,
    Input,
    VStack,
    Icon,
    CardHeader,
    HStack,
    Heading,
    IconButton
} from '@chakra-ui/react';
import { ChangeEvent, useState } from 'react';
import { FaArrowLeft, FaKey } from 'react-icons/fa6';
type Props = {
    login: () => void;
    signup: (walletName: string) => Promise<void>;
};

type Steps = 'main' | 'alreadyHaveWallet' | 'createWallet' | 'connectWallet';

export const Onboarding = ({ login, signup }: Props) => {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const [step, setStep] = useState<Steps>('main');

    if (step === 'alreadyHaveWallet') {
        return (
            <Card w="md">
                <CardHeader>
                    <HStack>
                        <IconButton
                            size="sm"
                            aria-label="Go back"
                            icon={<Icon as={FaArrowLeft} />}
                            onClick={() => setStep('main')}
                        />

                        <Heading size="md">Already have a wallet</Heading>
                    </HStack>
                </CardHeader>
                <CardBody>
                    <VStack spacing={4} w="full">
                        <Button
                            size={'lg'}
                            onClick={login}
                            leftIcon={<Icon as={FaKey} />}
                        >
                            Passkey
                        </Button>

                        <ConnectKitButton />
                    </VStack>
                </CardBody>
            </Card>
        );
    }

    if (step === 'createWallet') {
        return (
            <Card w="md">
                <CardHeader>
                    <HStack>
                        <IconButton
                            size="sm"
                            aria-label="Go back"
                            icon={<Icon as={FaArrowLeft} />}
                            onClick={() => setStep('main')}
                        />

                        <Heading size="md">Create wallet</Heading>
                    </HStack>
                </CardHeader>
                <CardBody>
                    <VStack spacing={4} w="full">
                        <Input
                            type="text"
                            placeholder="Wallet name ..."
                            onChange={handleInputChange}
                            value={inputValue}
                        />
                        <Button
                            isDisabled={!inputValue}
                            onClick={() => signup(`LFGHO - ${inputValue}`)}
                        >
                            Create wallet
                        </Button>
                    </VStack>
                </CardBody>
            </Card>
        );
    }

    return (
        <Card w="md">
            <CardHeader>
                <Heading size="md">Welcome to GETGHO!</Heading>
            </CardHeader>
            <CardBody>
                <VStack spacing={4} w="full">
                    <Button size={'lg'} onClick={() => setStep('createWallet')}>
                        Get a wallet
                    </Button>
                    <Button
                        variant={'link'}
                        onClick={() => setStep('alreadyHaveWallet')}
                    >
                        Already have a wallet?
                    </Button>
                </VStack>
            </CardBody>
        </Card>
    );
};
