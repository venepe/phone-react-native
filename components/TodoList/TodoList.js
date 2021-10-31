import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  PermissionsAndroid,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import _ from 'lodash';
import { FAB } from 'react-native-paper';
import { connect } from 'react-redux';
import TodoListItem from './TodoListItem';
import Empty from './Empty';
import { requestTodos, requestDeleteTodo, requestUpdateTodo } from '../../actions/todo';
import { getToken, getAccountId } from '../../reducers';
import { getTodos } from '../../reducers/todo';
import { initSocket } from '../../utilities/socket';
import analytics, { EVENTS } from '../../analytics';
import R from '../../resources';

class TodoList extends Component {

  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.fetch = this.fetch.bind(this);
    this.stopFetching = this.stopFetching.bind(this);
    this.onCreateTodoList = this.onCreateTodoList.bind(this);
    this.onPressRow = this.onPressRow.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.state = {
      isFetching: false,
      token: props.token,
      accountId: props.accountId,
      todos: [],
    };
  }

  async fetch() {
    try {
      this.props.requestTodos();
    } catch (e) {
      console.log(e);
    }
  }

  componentDidMount() {
    const { accountId } = this.state;
    initSocket({ accountId });
    this.fetch();
    analytics.track(EVENTS.VIEWED_SHOPPING_LISTS);
  }

  async componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.token !== prevProps.token) {
      this.setState({
        token: props.token,
      });
    }
    if (props.accountId !== prevProps.accountId) {
      this.setState({
        accountId: props.accountId,
      });
    }
    if (props.todos !== prevProps.todos) {
      this.setState({
        todos: props.todos,
      });
    }
  }

  async onRefresh() {
    this.setState({
      isFetching: true,
    });
    await this.fetch();;
    this.stopFetching();
  }

  stopFetching() {
    if (this.state.isFetching) {
      this.setState({ isFetching: false });
    }
  }

  onCreateTodoList() {
    this.props.navigation.navigate('TodoStack', { screen: 'CreateTodo' });
  }

  async onPressRow({ id }) {
    this.props.requestUpdateTodo({ todoId: id });
  }

  onDelete({ id }) {
    this.props.requestDeleteTodo({ todoId: id });
  }

  renderItem({ item }) {
    const { navigation } = this.props;
    return (
      <TodoListItem todoListItem={item} navigation={navigation} onPressRow={this.onPressRow} onDelete={this.onDelete}/>
    )
  }

  render() {
    const { isFetching, todos } = this.state;
    return (
      <View style={styles.root}>
        <FlatList
          data={todos}
          keyExtractor={(todos) => todos.id}
          renderItem={this.renderItem}
          refreshControl={(<RefreshControl tintColor={R.colors.TEXT_MAIN}
            progressBackgroundColor={R.colors.BACKGROUND_DARK}  colors={[R.colors.TEXT_MAIN]}
            refreshing={isFetching} onRefresh={() => this.onRefresh()} />)}
          ListEmptyComponent={(<Empty navigation={this.props.navigation}/>)}
          ListFooterComponent={() => {
            return (<View></View>)
          }
        }
        />
        <FAB
          color={R.colors.TEXT_MAIN}
          style={styles.fab}
          large
          icon='plus'
          onPress={() => this.onCreateTodoList()}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: R.colors.BACKGROUND_DARK,
  },
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 15,
    bottom: 30,
  },
});

TodoList.defaultProps = {};

TodoList.propTypes = {}

const mapStateToProps = state => ({
  token: getToken(state),
  accountId: getAccountId(state),
  todos: getTodos(state),
});

export default connect(
  mapStateToProps,
  { requestTodos, requestDeleteTodo, requestUpdateTodo },
)(TodoList);
