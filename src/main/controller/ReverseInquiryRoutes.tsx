import React, { Component, Fragment } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

// model
import User from 'user/model/User';
import { RayonEvent, RayonEventResponse, LogSignUpEventArgs } from 'common/model/RayonEvent';

// dc
import UserDC from 'user/dc/UserDC';

// view
import TabNav from 'common/view/nav/TabNav';
import RayonIntroView from 'home/view/RayonIntroView';

// import AuctionBoardVC from 'auction/vc/AuctionBoardVC';
// import MessageBoardVC from 'message/vc/MessageBoardVC';
// import AuctionContentVC from 'auction/vc/AuctionContentVC';
// import MessageContentVC from 'message/vc/MessageContentVC';
// import RegisterFinanceInfoVC from 'user/vc/RegisterFinanceInfoVC';

interface ReverseInquiryRoutesState {
  isUser: boolean;
}

class ReverseInquiryRoutes extends Component<{}, ReverseInquiryRoutesState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
    };
  }
  route = [
    // {
    //   path: '/',
    //   component: AuctionBoardVC,
    //   exact: true,
    // },
    // {
    //   path: '/registerdata',
    //   component: RegisterFinanceInfoVC,
    //   exact: true,
    // },
    // {
    //   path: '/auction/content/:id',
    //   component: AuctionContentVC,
    //   exact: false,
    // },
    // {
    //   path: '/loanrequest',
    //   component: AuctionBoardVC,
    //   exact: true,
    // },
    // {
    //   path: '/mailbox',
    //   component: MessageBoardVC,
    //   exact: true,
    // },
    // {
    //   path: '/message/content/:id',
    //   component: MessageContentVC,
    //   exact: false,
    // },
  ];

  async componentWillMount() {
    // check user registered
    const isUser = await UserDC.isUser();

    // watch sign up event for getting new user infomation
    if (!isUser) UserDC.addEventListener(RayonEvent.LogSignUpUser, this.onUserSignUp.bind(this));
    this.setState({ ...this.state, isUser });
  }

  componentWillUnmount() {
    UserDC.addEventListener(RayonEvent.LogSignUpUser, this.onUserSignUp.bind(this));
  }

  onUserSignUp(event: RayonEventResponse<LogSignUpEventArgs>) {
    this.setState({ ...this.state, isUser: true });
  }

  render() {
    const { isUser } = this.state;
    return (
      <Fragment>
        {!isUser ? (
          <RayonIntroView />
        ) : (
          // <div>gogogo</div>
          // <BrowserRouter>
            <Fragment>
              <TabNav  />
          {/* {this.route.map((item, index) => {
          //       return (
          //         <Route
          //           key={index}
          //           exact={item.exact}
          //           path={item.path}
          //           render={props => <item.component {...props} {...this.props} {...this.state} />}
          //         />
          //       );
          //     })} */}
          </Fragment>
          // </BrowserRouter>
        )}
      </Fragment>
    );
  }
}

export default ReverseInquiryRoutes;