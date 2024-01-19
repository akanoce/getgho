import { ChangeEvent, useState } from 'react';
import { useSponsoredTransaction, useTransaction } from '@repo/lfgho-sdk';
import { Address } from 'viem';
import {
    Button,
    Card,
    CardBody,
    FormControl,
    FormLabel,
    Heading,
    Input,
    VStack,
    HStack,
    Stack,
    CardHeader
} from '@chakra-ui/react';

export const SendSponsoredTx = () => {
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

    const { sendTransaction } = useTransaction();
    const { sponsoredTransaction } = useSponsoredTransaction();

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
                <CardHeader>
                    <HStack w="full" justify={'space-between'}>
                        <Heading size="md">
                            Send Sponsored Eth with USDC
                        </Heading>
                    </HStack>
                </CardHeader>
                <CardBody>
                    <VStack spacing={4} alignItems={'flex-start'}>
                        <FormControl>
                            <FormLabel>Amount in USDC</FormLabel>
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
                <CardHeader>
                    <HStack w="full" justify={'space-between'}>
                        <Heading size={'md'}>Send Eth</Heading>
                    </HStack>
                </CardHeader>
                <CardBody>
                    <VStack spacing={4} alignItems={'flex-start'}>
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
