#!/bin/bash

set -e

TEST_ENV=""
if [[ -n "$CI" ]]; then
  TEST_ENV="--env ci"
fi
if [[ -n "$2" ]]; then
  TEST_ENV="--env $2"
fi

function unitTests {
  echo "Running Unit Tests..."
  pushd ./functions/confirm
  npm test
  popd
}

function functionalTests {
  echo "Running Functional Tests..."
  cat ./functions/confirm/test/resources/sampleEvent.json | apex invoke confirm $TEST_ENV
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
