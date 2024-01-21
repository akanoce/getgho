import { Button } from '@chakra-ui/button';
import { Card, CardBody } from '@chakra-ui/card';
import { Text, VStack } from '@chakra-ui/layout';

export const GetGho = () => {
    return (
        <Card>
            <CardBody>
                <VStack>
                    <Text>Get as much go as possible from your balances</Text>
                    <Text>The All-in button!</Text>
                    <Button colorScheme="green">Get Gho</Button>
                </VStack>
            </CardBody>
        </Card>
    );
};
