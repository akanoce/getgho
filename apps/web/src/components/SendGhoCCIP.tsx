import { useReserves, useUserReservesIncentives } from '@/api';
import { supportedNetworks } from '@/const/ccip';
import {
    Button,
    Card,
    CardBody,
    FormControl,
    FormLabel,
    HStack,
    Heading,
    Input,
    Select,
    Spinner,
    VStack
} from '@chakra-ui/react';
import { useTransactions } from '@repo/lfgho-sdk';
import { ChangeEvent    , useMemo, useState } from 'react';
import { Hex } from 'viem';



export const SendGhoCCIP = () => {
    const [address, setAdddress] = useState<string>('');
    const [supportedNetwork, setSupportedNetwork] = useState<string>("");
    const [amount, setAmount] = useState<number>(0);

    const { data: reserves, isLoading: reservesLoading } = useReserves();

    const tokenDecimals = useMemo(() => {
        return reserves?.formattedReserves
            .filter((reserve) => reserve.symbol === "GHO")[0]?.decimals;
    }, [reserves]);

    const ghoAddress = useMemo(() => {
        return reserves?.formattedReserves
            .filter((reserve) => reserve.symbol === "GHO")[0]?.underlyingAsset;
    }, [reserves]);


    const { sendCCIPtransferSponsored } =
    useTransactions();

    const handleTransferGHO = () => {
        const amountToBigInt = BigInt(Number(amount) * 10 ** (tokenDecimals ?? 0));

        console.log('amountToBigInt', amountToBigInt);

        sendCCIPtransferSponsored({
          sourceChain: "ethereumSepolia",
            destinationChain: "arbitrumTestnet",
            destinationAccount: address as Hex,
            amount: amountToBigInt,
            tokenToTransfer: ghoAddress as Hex,
        });
    };

 

    const handleAddressChangeSponsored = (e: ChangeEvent<HTMLInputElement>) => {
        setAdddress(e.target.value);
    };

    if (reservesLoading === true) {
        <HStack justifyContent="center">
            <Card width="100%">
                <Spinner />
            </Card>
        </HStack>;
    }

    return (
        <HStack justifyContent="center">
            <Card width="100%">
                <CardBody>
                    <VStack spacing={4} alignItems={'flex-start'}>
                        <Heading>Send GHO cross-chain
                        </Heading>
                        <FormControl>
                            <Select
                                placeholder="Select option"
                                onChange={(e) =>
                                    setSupportedNetwork(e.target.value)
                                }
                            >
                                {supportedNetworks.map((network) => (
                                    <option value={network}>{network}</option>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Amount to Send</FormLabel>
                            <Input
                                id="amount"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Address to Send</FormLabel>
                            <Input
                                id="address"
                                value={address}
                                onChange={handleAddressChangeSponsored}
                            />
                        </FormControl>
                        <Button disabled={!address || !amount} onClick={handleTransferGHO}>
                            Send
                        </Button>
                    </VStack>
                </CardBody>
            </Card>
        </HStack>
    );
};
