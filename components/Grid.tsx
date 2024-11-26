import { View, SafeAreaView, Text, StyleSheet } from 'react-native'

const edngeCases = (i: number, j: number) => {
    
    let res = {
        borderTopWidth: 0,
        borderRightWidth: 0
    }
    if(i == 0)
        res.borderTopWidth = 1

    if(j == 4)
        res.borderRightWidth = 1

    return res
}

export default function Grid(props: any){
    return (
        <View>
        <View style={styles.container}>
            { Array.from({length: 13}).map( (_, i) => (
                
                <View key ={i} style={styles.rowContainer}>
                    {Array.from({length: 5}).map( (__, j) => (
                        
                        <View key={i*5+j} style={[styles.block, edngeCases(i, j)]}></View>
                        
                    )
                    )}
                </View>
            )
            )}

            
        </View>

        { // events (TBA)
            <View style={styles.event}>
                <Text>{`Mat 3\nPED AMF`}</Text>
            </View>
        }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    rowContainer: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'stretch'
        
    },
    block: {        
        width: '20%',
        borderColor: '#1115',
        borderLeftWidth: 1,
        borderBottomWidth: 1
    },
    event: {
        backgroundColor: 'rgb(220, 180, 50)',
        textAlignVertical: 'center',

        width: '20%',
        height: `${100/13*2.75}%`,
        position: 'absolute',
        left: '0%',
        top: '0%'
    }
})