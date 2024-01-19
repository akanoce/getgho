import { useCounterFactualAddress } from '@repo/lfgho-sdk';
import { ConnectKitButton } from 'connectkit';
import { ChangeEvent, useState } from 'react';
import { parseEther } from 'viem';
import { sepolia, useAccount, useSendTransaction } from 'wagmi';
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    FormControl,
    FormLabel,
    HStack,
    Heading,
    Input,
    Spinner,
    VStack
} from '@chakra-ui/react';

export const Deposit = () => {
    const { addressRecords } = useCounterFactualAddress();
    const wallet = addressRecords?.[sepolia.id];

    const { isConnected } = useAccount();
    const { sendTransaction, isLoading, error, isSuccess } =
        useSendTransaction();
    const [amount, setAmount] = useState('');

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value);
    };

    const handleDeposit = () => {
        sendTransaction({
            to: wallet as `0x${string}`,
            value: parseEther(amount)
        });
    };

    if (!isConnected)
        return (
            <Card>
                <CardBody>
                    <span>Deposit funds to AA</span>
                    <ConnectKitButton />
                </CardBody>
            </Card>
        );
    return (
        <Card>
            <CardHeader>
                <HStack justifyContent={'space-between'} w="full">
                    <Heading size="md">Deposit to account</Heading>
                    <ConnectKitButton />
                </HStack>
            </CardHeader>
            <CardBody>
                <VStack spacing={4} alignItems={'flex-start'}>
                    <FormControl>
                        <FormLabel>Amount</FormLabel>
                        <Input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={handleAmountChange}
                        />
                    </FormControl>
                    <Button disabled={!Number(amount)} onClick={handleDeposit}>
                        {isLoading ? <Spinner /> : 'Deposit '}
                    </Button>
                    {error && <span>{error.message}</span>}
                    {isSuccess && <span>Deposit successful</span>}
                </VStack>
            </CardBody>
        </Card>
    );
};
