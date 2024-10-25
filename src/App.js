import React, { Component } from "react";
import "./App.css";
import * as d3 from 'd3';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {wordFrequency:[]};
  }
  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate() {
    this.renderChart();
  }

  getWordFrequency = (text) => {
    const stopWords = new Set(["the", "and", "a", "an", "in", "on", "at", "for", "with", "about", "as", "by", "to", "of", "from", "that", "which", "who", "whom", "this", "these", "those", "it", "its", "they", "their", "them", "we", "our", "ours", "you", "your", "yours", "he", "him", "his", "she", "her", "hers", "it", "its", "we", "us", "our", "ours", "they", "them", "theirs", "I", "me", "my", "myself", "you", "your", "yourself", "yourselves", "was", "were", "is", "am", "are", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "as", "if", "each", "how", "which", "who", "whom", "what", "this", "these", "those", "that", "with", "without", "through", "over", "under", "above", "below", "between", "among", "during", "before", "after", "until", "while", "of", "for", "on", "off", "out", "in", "into", "by", "about", "against", "with", "amongst", "throughout", "despite", "towards", "upon", "isn't", "aren't", "wasn't", "weren't", "haven't", "hasn't", "hadn't", "doesn't", "didn't", "don't", "doesn't", "didn't", "won't", "wouldn't", "can't", "couldn't", "shouldn't", "mustn't", "needn't", "daren't", "hasn't", "haven't", "hadn't"]);
    const words = text.toLowerCase().replace(/[.,/#!$%^&*;:{}=_`~()]/g, "").replace(/\s{2,}/g, " ").split(" ");
    const filteredWords = words.filter(word => !stopWords.has(word));
    const wordFreq = filteredWords.reduce((freq, word) => {
      freq[word] = (freq[word] || 0) + 1;
      return freq;
    }, {});
    return Object.entries(wordFreq).filter(([word, count]) => word && count > 0);    
  }

  renderChart() {
    const data = (this.state.wordFrequency || [])
        .filter(d => Array.isArray(d) && d.length >= 2)
        .sort((a, b) => b[1] - a[1]) // Sort by frequency
        .slice(0, 5); // Limit to top 5 words

    // Check if we have data to render
    if (!data.length) {
        console.log("No valid word frequency data to display.");
        return;
    }

    // Set up font size scaling based on word frequency
    const svgWidth = 800;
    const svgHeight = 200;
    const maxFontSize = 80;
    const minFontSize = 20;
    const fontScale = d3.scaleLinear()
        .domain([data[data.length - 1][1], data[0][1]]) // From lowest to highest frequency
        .range([minFontSize, maxFontSize]); // Minimum and maximum font sizes

    // Select the SVG and set dimensions
    const svg = d3.select(".svg_parent")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // Calculate initial x positions based on ranks (leftmost for most frequent)
    const xPositions = data.map((_, i) => svgWidth / (data.length + 1) * (i + 1));
    const yPosition = svgHeight / 2;

    // Bind data to text elements with animation for growth and reordering
    const words = svg.selectAll("text")
        .data(data, d => d[0]); // Use word as the key

    // Remove old elements
    words.exit().remove();

    // Update existing elements
    words
        .transition()
        .duration(1500) // Duration for smooth growth and repositioning
        .ease(d3.easeCubicOut)
        .attr("x", (d, i) => xPositions[i]) // Update x position based on new order
        .attr("y", yPosition) // Keep y position centered
        .attr("font-size", d => fontScale(d[1])) // Scale font size based on frequency

    // Add new elements
    words.enter()
        .append("text")
        .text(d => d[0]) // Word
        .attr("y", yPosition) // Center vertically in the SVG
        .attr("x", (d, i) => xPositions[i]) // Initial x position based on rank
        .attr("font-size", 1) // Start small for animation
        .attr("fill", "black")
        .transition()
        .duration(1500) // Duration for growth animation
        .ease(d3.easeCubicOut)
        .attr("font-size", d => fontScale(d[1])) // Scale font size based on frequency
        .attr("x", (d, i) => xPositions[i]); // Ensure it repositions based on new ranks

    // Update the previous first word to track changes
    this.previousFirstWord = data[0][0]; // Track the new most frequent word
}




  render() {
    return (
      <div className="parent">
        <div className="child1" style={{width: 1000 }}>
        <textarea type="text" id="input_field" style={{ height: 150, width: 1000 }}/>
          <button type="submit" value="Generate Matrix" style={{ marginTop: 10, height: 40, width: 1000 }} onClick={() => {
                var input_data = document.getElementById("input_field").value
                this.setState({wordFrequency:this.getWordFrequency(input_data)})
              }}
            > Generate WordCloud</button>
        </div>
        <div className="child2"><svg className="svg_parent"></svg></div>
      </div>
    );
  }
}

export default App;