const assert = require('assert')

class Car {
  park() {
    return 'stopped'
  }

  drive() {
    return 'vroom'
  }
}

let car

// Run before each "it" statement
beforeEach(() => {
  car = new Car()
})

describe('Car', () => {
  it('can park', () => {
    assert.strictEqual(car.park(), 'stopped')
  })

  it('can drive', () => {
    assert.strictEqual(car.drive(), 'vroom')
  })
})