import { ChangeEvent, useState } from 'react';
import { useTransactions } from '@repo/lfgho-sdk';
import { Address } from 'viem';
import {
    Button,
    Card,
    CardBody,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Stack,
    Heading
} from '@chakra-ui/react';

export const SendTx = () => {
    const [amountSponsored, setAmountSponsored] = useState('0');
    const [addressToSponsored, setAddressToSponsored] = useState('');

    const [amount, setAmount] = useState('0');
    const [addressTo, setAddressTo] = useState('');

    const handleAmountChangeSponsored = (e: ChangeEvent<HTMLInputElement>) => {
        setAmountSponsored(e.target.value);
    };

    const handleAddressChangeSponsored = (e: ChangeEvent<HTMLInputElement>) => {
        setAddressToSponsored(e.target.value);
    };

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value);
    };

    const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAddressTo(e.target.value);
    };

    const { sendTransaction, sponsoredTransaction } = useTransactions();

    const handleSendSponsored = () => {
        const amountToBigInt = BigInt(Number(amountSponsored) * 1e18);

        console.log('amountToBigInt', amountToBigInt);

        sponsoredTransaction({
            to: addressToSponsored as Address,
            value: amountToBigInt
        });
    };

    const handleSend = () => {
        const amountToBigInt = BigInt(Number(amount) * 1e18);
        console.log('amountToBigInt', amountToBigInt);

        sendTransaction({
            to: addressTo as Address,
            value: amountToBigInt
        });
    };

    return (
        <Stack direction={['column', 'row']} w="full" justify="space-between">
            <Card flex={1}>
                <CardBody>
                    <VStack spacing={4} alignItems={'flex-start'}>
                        <Heading>Send Sponsored Tx</Heading>
                        <FormControl>
                            <FormLabel>Amount in Eth</FormLabel>
                            <Input
                                id="amount"
                                type="number"
                                value={amountSponsored}
                                onChange={handleAmountChangeSponsored}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Address to Send</FormLabel>
                            <Input
                                id="address"
                                value={addressToSponsored}
                                onChange={handleAddressChangeSponsored}
                            />
                        </FormControl>
                        <Button
                            disabled={!Number(amount) || !addressTo}
                            onClick={handleSendSponsored}
                        >
                            Send
                        </Button>
                    </VStack>
                </CardBody>
            </Card>

            <Card flex={1}>
                <CardBody>
                    <VStack spacing={4} alignItems={'flex-start'}>
                        <Heading>Send Tx</Heading>
                        <FormControl>
                            <FormLabel>Amount in Eth</FormLabel>
                            <Input
                                id="amount"
                                type="number"
                                value={amount}
                                onChange={handleAmountChange}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Address to Send</FormLabel>
                            <Input
                                id="address"
                                value={addressTo}
                                onChange={handleAddressChange}
                            />
                        </FormControl>
                        <Button
                            disabled={!Number(amount) || !addressTo}
                            onClick={handleSend}
                        >
                            Send
                        </Button>
                    </VStack>
                </CardBody>
            </Card>
        </Stack>
    );
};
