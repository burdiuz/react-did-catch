# React Did Catch

> Note: After revisiting this work I see this is not going to work and I will not work in this direction. it's now archived.

Simple wrapper for `componentDidCatch` using react context provides
methods to catch errors in event handlers.


Automatically wrap all callbacks in props:
```javascript
const ErrorButton = withErrorCatcher(({ onPress }) => (
  <Button onPress={onPress} title="Click me to get an error" />
));

export default () => (
  <ErrorCatcherProvider whenDidCatch={(error, info) => console.log({ error, info })}>
    <View>
      <Text>This button fires error:</Text>
    </View>
    <View>
      <ErrorButton
        onPress={() => {
          throw new Error('Something went wrong!');
        }}
      />
    </View>
  </ErrorCatcherProvider>
);
```

Manually wrap only required callbacks:
```javascript
const ErrorButton = withErrorCatcher(({ tryWrap }) => (
  <Button
    onPress={tryWrap(() => {
      throw new Error('Something went wrong!');
    })}
    title="Click me to get an error"
  />
), false);

export default () => (
  <ErrorCatcherProvider whenDidCatch={(error, info) => console.log({ error, info })}>
    <View>
      <Text>This button fires error:</Text>
    </View>
    <View>
      <ErrorButton />
    </View>
  </ErrorCatcherProvider>
);
```

> For React Native [global error handler extension](https://github.com/master-atul/react-native-exception-handler) is available.
