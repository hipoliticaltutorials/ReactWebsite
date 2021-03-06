import React from "react";
import PropTypes from "prop-types";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

class FunctionablePaginator extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.pageClicked = this.pageClicked.bind(this);
    this.nextClicked = this.nextClicked.bind(this);
    this.prevClicked = this.prevClicked.bind(this);
    this.changePage = this.changePage.bind(this);

    this.state = { Current: 1, Pages: this.getItems(1) };
  }

  getItems(startPage) {
    let items = [];
    var maxItems = Math.min(this.props.totalPages, this.props.totalDisplayed);
    for (var i = startPage; i <= maxItems + startPage - 1; i++) {
      items[i] = i;
    }
    return items;
  }

  pageClicked(e) {
    e.preventDefault();

    let pageNumber = parseInt(e.target.getAttribute("href"));
    //only change page if user clicks on a different one than what is current
    if (pageNumber !== this.state.Current) {
      this.changePage(pageNumber);
    }
  }
  changePage(pageNumber, pages) {
    if (pages) {
      this.setState({ Current: pageNumber, Pages: pages }, () => {
        this.props.pageChanged(this.state.Current);
      });
    } else {
      this.setState({ Current: pageNumber }, () => {
        this.props.pageChanged(this.state.Current);
      });
    }
  }
  nextClicked(e) {
    e.preventDefault();

    const nextPage = this.state.Current + 1;
    const items = this.state.Pages.includes(nextPage)
      ? null
      : this.getItems(nextPage - this.props.totalDisplayed + 1);
    this.changePage(nextPage, items);
  }

  prevClicked(e) {
    e.preventDefault();

    const nextPage = this.state.Current - 1;
    const pages = this.state.Pages.includes(nextPage)
      ? null
      : this.getItems(nextPage);

    this.changePage(nextPage, pages);
  }

  render() {
    return (
      <Pagination>
        <PaginationItem disabled={this.state.Current === 1}>
          <PaginationLink previous onClick={this.prevClicked} />
        </PaginationItem>

        {this.state.Pages.map(p => {
          return (
            <PaginationItem key={p} active={p === this.state.Current}>
              <PaginationLink onClick={this.pageClicked} href={p}>
                {p}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem disabled={this.state.Current === this.props.totalPages}>
          <PaginationLink next onClick={this.nextClicked} />
        </PaginationItem>
      </Pagination>
    );
  }
}

FunctionablePaginator.propTypes = {
  //fired when user clicks a page number
  pageChanged: PropTypes.func.isRequired,
  //the total number of pages
  totalPages: function(props, propName, component) {
    if (!props.totalPages) {
      return new Error("totalPages is required");
    } 
  },
  //the total number of pages displayed
  totalDisplayed: PropTypes.number
};

FunctionablePaginator.defaultProps = {
  totalDisplayed: 5,
  totalPages: 5
};
export default FunctionablePaginator;