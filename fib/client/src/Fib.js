import React, { Component } from "react"
import axios from "axios"

class Fib extends Component {
  state = {
    seenIndexes: [],
    values: {},
    index: ''
  }

  componentDidMount() {
    this.fetchValues()
    this.fetchIndexes()
  }

  async fetchValues() {
    const values = await axios.get("/api/values/current")
    console.log(`Values: `, values.data)
    this.setState({ values: values.data })
  }

  async fetchIndexes() {
    const seenIndexes = await axios.get("/api/values/all")
    console.log(`Values: `, seenIndexes.data)
    this.setState({
      seenIndexes: seenIndexes.data
    })
  }

  renderSeenIndexes() {
    return this.state.seenIndexes.map(({ number }) => number).join(", ")
  }

  renderValues() {
    const entries = []
    for (let key in this.state.values) {
      entries.push(
        <div key={ key }>
          <div>
            For index { key } I calculated { this.state.values[ key ] }
          </div>
        </div>
      )
    }
    return entries
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    axios.post("/api/values", {
      index: this.state.index
    })
    this.setState({ index: "" })
  }

  render() {
    return (
      <div>
        <form onSubmit={ this.handleSubmit }>
          <label>Enter your index</label>
          <input
            value={ this.state.index }
            onChange={ event => this.setState({ index: event.target.value }) } />
          <button>Submit</button>
        </form>

        <h3>Indexes I have seen</h3>
        { this.renderSeenIndexes() }

        <h3>Calculate values</h3>
        { this.renderValues() }
      </div>
    )
  }
}

export default Fib