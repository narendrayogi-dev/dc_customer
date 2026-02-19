/* eslint-disable prettier/prettier */
// /* eslint-disable prettier/prettier */
// import React from 'react';
// import {Text} from 'react-native';
// import {DataTable} from 'react-native-paper';

// const numberOfItemsPerPageList = [2, 3, 4];

// const items = [
//   {
//     key: 1,
//     name: 'Page 1',
//   },
//   {
//     key: 2,
//     name: 'Page 2',
//   },
//   {
//     key: 3,
//     name: 'Page 3',
//   },
// ];

// const MyComponent = () => {
//   const [page, setPage] = React.useState(0);
//   const [numberOfItemsPerPage, onItemsPerPageChange] = React.useState(1);
//   const from = page * numberOfItemsPerPage;
//   const to = Math.min((page + 1) * numberOfItemsPerPage, items.length);

//   React.useEffect(() => {
//     setPage(0);
//   }, [numberOfItemsPerPage]);

//   return (
//     <>
//       <Text>hii</Text>
//       <DataTable>
//         <DataTable.Pagination
//           page={page}
//           numberOfPages={Math.ceil(items.length / numberOfItemsPerPage)}
//           onPageChange={a => setPage(a)}
//           label={`${from + 1}-${to} of ${items.length}`}
//           showFastPaginationControls
//           numberOfItemsPerPageList={numberOfItemsPerPageList}
//           numberOfItemsPerPage={numberOfItemsPerPage}
//           onItemsPerPageChange={onItemsPerPageChange}
//           selectPageDropdownLabel={'Rows per page'}
//         />
//       </DataTable>
//     </>
//   );
// };

// export default MyComponent;

//<<<<<<--------------------------------------------------------------------------------------------------------------------------->>>>>>>
//<<<<<<--------------------------------------------------------------------------------------------------------------------------->>>>>>>
//<<<<<<--------------------------------------------------------------------------------------------------------------------------->>>>>>>

// import 'react-native-gesture-handler';
// import React, {useEffect, useState} from 'react';
// import {View, Text, Button, TextInput, ActivityIndicator} from 'react-native';
// // import { NavigationContainer } from '@react-navigation/native';
// // import { createStackNavigator } from '@react-navigation/stack';
// // import { createDrawerNavigator } from '@react-navigation/drawer'
// import {
//   DataTable,
//   page,
//   setPage,
//   setItemsPerPage,
//   optionsPerPage,
//   itemsPerPage,
// } from 'react-native-paper';

// // const Drawer = createDrawerNavigator();

// function SearchComponent() {
//   return <View style={{flex: 1}}>Search Bar</View>;
// }

// function TableComponent({headers, values}) {
//   // if (!headers || !values) return null;
//   const optionsPerPage = [0];
//   const [page, setPage] = useState(0);
//   const [itemsPerPage, setItemsPerPage] = useState(optionsPerPage[10]);
//   return (
//     <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
//       <DataTable.Row style={{width: 1000}}>
//         <DataTable.Cell text>First Name</DataTable.Cell>
//         <DataTable.Cell text>Last Name</DataTable.Cell>
//         <DataTable.Cell text>Provider Email</DataTable.Cell>
//         <DataTable.Cell text>Review</DataTable.Cell>
//         <DataTable.Cell text>Rating</DataTable.Cell>
//         <DataTable.Cell text>Review Completed</DataTable.Cell>
//       </DataTable.Row>
//       <DataTable style={{width: 1000}}>
//         {/* {headers?.map(({ title, numeric }) => <DataTable.Title key={title} numeric={numeric}>{title}</DataTable.Title>)} */}
//         {values?.map((value, index) => (
//           <DataTable.Row key={index}>
//             {headers?.map(({title}) => (
//               <DataTable.Cell key={title}>{value[title]}</DataTable.Cell>
//             ))}
//           </DataTable.Row>
//         ))}
//         <DataTable.Pagination
//           page={page}
//           numberOfPages={1000}
//           onPageChange={page => setPage(page)}
//           label="1-2 of 1000"
//           optionsPerPage={optionsPerPage}
//           itemsPerPage={itemsPerPage}
//           setItemsPerPage={setItemsPerPage}
//           optionsLabel={'Rows per page'}
//         />
//       </DataTable>
//       <Text>hii</Text>
//     </View>
//   );
// }
// export default TableComponent;

//<<<<------------------------------------------------------------------------------------------------------------->>>>>>>>
//<<<<------------------------------------------------------------------------------------------------------------->>>>>>>>
//<<<<------------------------------------------------------------------------------------------------------------->>>>>>>>

//This is an example of React Native
//FlatList Pagination to Load More Data dynamically - Infinite List
import React, {Component} from 'react';
//import react in our code.

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Platform,
  ActivityIndicator,
} from 'react-native';
//import all the components we are going to use.

export default class MyComponent extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      //Loading state used while loading the data for the first time
      serverData: [],
      //Data Source for the FlatList
      fetching_from_server: false,
      //Loading state used while loading more data
    };
    this.offset = 0;
    //Index of the offset to load from web API
  }

  componentDidMount() {
    //fetch('http://aboutreact.com/demo/getpost.php?offset=' + this.offset)

    fetch('https://mosambiindia.com/old_gunjan_backup/admin/BusApi/getBusCity')
      .then(response => response.json())
      .then(responseJson => {
        const newResponse = responseJson.data;
        responseJson = newResponse.slice(
          this.offset * 12,
          (this.offset + 1) * 12 - 1,
        );
    //  console.log('offset : ' + this.offset);

    //  console.log(
          responseJson.slice(this.offset * 12, (this.offset + 1) * 12 - 1),
        );
        //Successful response from the API Call
        this.offset = this.offset + 1;
        //After the response increasing the offset for the next API call.
    //  console.log('data');
        this.setState({
          // serverData: [...this.state.serverData, ...responseJson.results],
          serverData: [...this.state.serverData, ...responseJson],
          //adding the new data with old one available in Data Source of the List
          loading: false,
          //updating the loading state to false
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  loadMoreData = () => {
    //On click of Load More button We will call the web API again
    this.setState({fetching_from_server: true}, () => {
      //fetch('http://aboutreact.com/demo/getpost.php?offset=' + this.offset)
      fetch(
        'https://mosambiindia.com/old_gunjan_backup/admin/BusApi/getBusCity',
      )
        .then(response => response.json())
        .then(responseJson => {
          const newResponse = responseJson.data;
          responseJson = newResponse.slice(
            this.offset * 12,
            (this.offset + 1) * 12 - 1,
          );
      //  console.log('offset Load : ' + this.offset);
      //  console.log(responseJson);
          //Successful response from the API Call
          this.offset = this.offset + 1;

          //After the response increasing the offset for the next API call.
          this.setState({
            //serverData: [...this.state.serverData, ...responseJson.results],
            serverData: [...this.state.serverData, ...responseJson],
            fetching_from_server: false,
            //updating the loading state to false
          });
        })
        .catch(error => {
          console.error(error);
        });
    });
  };

  renderFooter() {
    return (
      //Footer View with Load More button
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={this.loadMoreData}
          //On Click of button calling loadMoreData function to load more data
          style={styles.loadMoreBtn}>
          <Text style={styles.btnText}>Loading</Text>
          {this.state.fetching_from_server ? (
            <>

            <ActivityIndicator color="white" style={{marginLeft: 8}} />
            <Text
            style={{
              marginTop: 10,
              color: '#000',
              fontSize: 16,
              textAlign: 'center',
            }}>
            Please wait...
          </Text>
            </>
          ) : null}
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            // keyExtractor={(item, index) => item?.id || index}
            style={{width: '100%'}}
            data={this.state.serverData}
            renderItem={({item, index}) => (
              <View style={styles.item}>
                <Text style={styles.text}>
                  {item.name}
                  {`\n`}
                  {'.'}
                  {`\n`}
                  {item.status}
                </Text>
              </View>
            )}
            onEndReached={this.loadMoreData}
            onEndReachedThreshold={0.1}
            //Adding Load More button as footer component
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
  },
  item: {
    padding: 10,
    height: 80,
  },
  separator: {
    height: 0.5,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  text: {
    fontSize: 15,
    color: 'black',
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  loadMoreBtn: {
    padding: 10,
    backgroundColor: '#800000',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
  },
});
