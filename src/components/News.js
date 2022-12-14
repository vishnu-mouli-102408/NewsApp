import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component';


export class News extends Component {
  static defaultProps = {
    country : "in",
    pageSize : 6,
    category : "General"
  }
  static propTypes = {
    country : PropTypes.string,
    pageSize : PropTypes.number,
    category : PropTypes.string,
  }
    constructor(props){
        super(props);
        this.state = {
            articles: [],
            loading: true,
            page:1,
            totalResults : 0
        }
        document.title = `${this.props.category} - NewsMonkey`
    }

   async updateNews(){
    this.props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pagesize=${this.props.pageSize}`
    this.setState({loading:true});
    let data = await fetch(url);
    this.props.setProgress(30);
    let parsedData = await data.json();
    this.props.setProgress(60);
    console.log(parsedData)
    this.setState({articles: parsedData.articles, 
                  totalResults: parsedData.totalResults,
                   loading: false})
    this.props.setProgress(1000);
   }

   async componentDidMount(){
    // let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=a4f1b6c61a154dc3b13e45e043aea341&pagesize=${this.props.pageSize}`
    // this.setState({loading:true});
    // let data = await fetch(url)
    // let parsedData = await data.json()
    // console.log(parsedData)
    // this.setState({articles: parsedData.articles, 
    //               totalResults: parsedData.totalResults,
    //                loading: false})
    this.updateNews();
   }
handlePreviousClick =async ()=>{
//   let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=a4f1b6c61a154dc3b13e45e043aea341&page=${this.state.page - 1}&pagesize=${this.props.pageSize}`
//   this.setState({loading:true});
//   let data = await fetch(url)
//   let parsedData = await data.json()
//   console.log(parsedData)
//    this.setState({
//      page: this.state.page - 1,
//      articles: parsedData.articles,
//      loading: false
//  })
this.setState({page:this.state.page - 1});
this.updateNews();
}

handleNextClick =async ()=>{
  // if(!(this.state.page + 1 > Math.ceil(this.state.totalResults/this.props.pageSize))){
  //   let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=a4f1b6c61a154dc3b13e45e043aea341&page=${this.state.page + 1}&pagesize=${this.props.pageSize}`
  //   this.setState({loading:true});
  //   let data = await fetch(url)
  //   let parsedData = await data.json()
  //   this.setState({
  //     page: this.state.page + 1,
  //     articles: parsedData.articles,
  //     loading:false
  //   })
  //}
    this.setState({page:this.state.page + 1});
    this.updateNews();
 }

   fetchMoreData =async ()=>{
    this.setState({
      page: this.state.page + 1})
      const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page+1}&pagesize=${this.props.pageSize}`
    // this.setState({loading:true});
    let data = await fetch(url)
    let parsedData = await data.json()
    console.log(parsedData)
    this.setState({articles: this.state.articles.concat(parsedData.articles), 
                  totalResults: parsedData.totalResults
   })
  }
   
  render() {
    return (
      <>
        <h1 className='text-center'style={{margin: '35px 0px'}} >NewsMonkey - Top {this.props.category} Headlines</h1>
        {this.state.loading && <Spinner/>}
        <InfiniteScroll
        dataLength={this.state.articles.length}
        next={this.fetchMoreData}
        hasMore={this.state.articles.length !== this.state.totalResults}
        loader={<Spinner/>}
        >

          <div className="container">
        <div className="row">
        {this.state.articles.map((element)=>{
             return   <div className="col-md-4" key={element.url}>
                <NewsItem  title={element.title?element.title.slice(0,40):""} description={element.description?element.description.slice(0,60):""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
                </div>
        })}
        </div>
        </div>
        </InfiniteScroll>
        {/* <div className="containe d-flex justify-content-between">
            <button disabled={this.state.page<=1} type="button" className="btn btn-dark" onClick={this.handlePreviousClick}> &larr; Previous</button>
            <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr;</button>
        </div> */}
      </>
    )
  }
}

export default News
