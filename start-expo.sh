#!/bin/bash
export EXPO_NO_OPEN=1
export BROWSER=none
export EXPO_NO_REACT_NATIVE_DEVTOOLS=1
export CI=1
npx expo start --web --port 5000
