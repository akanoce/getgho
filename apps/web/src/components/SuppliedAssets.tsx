import { useReserves, useUserReservesIncentives } from '@/api';
import {
    Card,
    CardBody,
    CardHeader,
    Heading,
    Table,
    TableContainer,
    Tag,
    Tbody,
    Td,
    Th,
    Thead,
    Tr
} from '@chakra-ui/react';
import { WithdrawAssetButton } from './WithdrawAssetButton';

type Props = {
    address: string;
};
export const SuppliedAssets = ({ address }: Props) => {
    const { data: userReserves, isLoading: userReservesLoading } =
        useUserReservesIncentives(address);

    const { data: reserves, isLoading: reservesLoading } = useReserves();

    console.log({ userReserves, reserves });

    const availableUnderlying =
        userReserves?.formattedUserSummary.userReservesData.filter(
            (reserve) => reserve.underlyingBalance !== '0'
        );

    console.log({ availableUnderlying });
    return (
        <Card>
            <CardHeader>
                <Heading fontSize={'2xl'}>Supplied Assets</Heading>
            </CardHeader>
            <CardBody>
                <TableContainer>
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Token</Th>
                                <Th>Underlying Balance</Th>
                                <Th>Underlying Balance USD</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {availableUnderlying?.map((reserve) => (
                                <Tr key={reserve.underlyingAsset}>
                                    <Td>
                                        <Tag colorScheme="blue">
                                            {reserve.reserve.name}
                                        </Tag>
                                    </Td>
                                    <Td>
                                        {reserve.underlyingBalance}{' '}
                                        {reserve.reserve.name}
                                    </Td>
                                    <Td>{reserve.underlyingBalanceUSD} USD</Td>
                                    <Td>
                                        <WithdrawAssetButton
                                            amount={reserve.underlyingBalance}
                                            reserveAddress={
                                                reserve.reserve.underlyingAsset
                                            }
                                        />
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </CardBody>
        </Card>
    );
};
