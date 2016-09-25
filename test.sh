#!/bin/bash

function unitTests {
  echo "Running Unit Tests..."
  pushd ./functions/confirm
  npm test
  popd
}

function functionalTests {
  echo "Running Functional Tests..."
  cat ./functions/confirm/test/resources/sampleEvent.json | apex invoke confirm
}

function fnTests {
  functionalTests
}

#Default
function Tests {
  functionalTests
}

function_name="$1Tests"
eval ${function_name}
