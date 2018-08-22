import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

// dc
import ReverseInquiryDC from 'reverseinquiry/dc/ReverseInquiryDC';
import UserDC from 'user/dc/UserDC';

// model
import ReverseInquiry from 'reverseinquiry/model/ReverseInquiry';
import { RayonEvent, RayonEventResponse, LogRegisterReverseInquiryArgs } from 'common/model/RayonEvent';

// util
import TimeConverter from 'common/util/TimeConverter';

// view
import Container from 'common/view/container/Container';
import ReverseInquiryRegisterVC from 'reverseinquiry/vc/ReverseInquiryRegisterVC';
import RayonModalView from 'common/view/modal/RayonModalView';
import RayonButton from 'common/view/button/RayonButton';

// styles
import styles from './ReverseInquiryBoardVC.scss';

interface ReverseInquiryBoardVCState {
  reverseInquiries: ReverseInquiry[];
  isSignUpModalOpen: boolean;
}

class ReverseInquiryBoardVC extends Component<{}, ReverseInquiryBoardVCState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      reverseInquiries: new Array<ReverseInquiry>(),
      isSignUpModalOpen: false,
    };
    this.LogRegisterReverseInquiry = this.LogRegisterReverseInquiry.bind(this);
    this.onReverseInquiriesFetched = this.onReverseInquiriesFetched.bind(this);
  }

  async componentWillMount() {
    ReverseInquiryDC.addEventListener(RayonEvent.LogRegisterReverseInquiry, this.LogRegisterReverseInquiry);
    ReverseInquiryDC.addReverseInquiriesListeners(this.onReverseInquiriesFetched);
    ReverseInquiryDC.fetchReverseInquiries();
  }

  componentWillUnmount() {
    ReverseInquiryDC.removeEventListener(RayonEvent.LogRegisterReverseInquiry, this.LogRegisterReverseInquiry);
    ReverseInquiryDC.removeReverseInquiriesListeners(this.onReverseInquiriesFetched);
  }

  onReverseInquiriesFetched(reverseInquiries: ReverseInquiry[]) {
    this.setState({ ...this.state, reverseInquiries });
  }

  LogRegisterReverseInquiry(event: RayonEventResponse<LogRegisterReverseInquiryArgs>) {
    const registeredReverseInquiry: ReverseInquiry = {
      id: event.args.id.toNumber(),
      title: event.args.title,
      description: event.args.description,
      financeData: event.args.financeData.split('%%'),
      userName: event.args.userName,
      userAddress: event.args.userAddress,
      insertTime: event.args.insertTime,
    };
    this.state.reverseInquiries.unshift(registeredReverseInquiry);
    this.setState({ ...this.state, reverseInquiries: this.state.reverseInquiries });
  }

  /*
  component callback
  */
  onRequestModalDisplayToggle() {
    this.setState({ ...this.state, isSignUpModalOpen: !this.state.isSignUpModalOpen });
  }

  render() {
    const { reverseInquiries } = this.state;
    const user = UserDC.getUser();
    return (
      <Fragment>
        <Container className={styles.contentContainer}>
          <div className={styles.titleSection}>
            <p className={styles.title}>Loan Request</p>
            {user.isBorrower && (
              <div className={styles.buttonWrap}>
                <RayonButton
                  className={styles.registerBtn}
                  title={'New Request'}
                  isBorrower={true}
                  onClickButton={this.onRequestModalDisplayToggle.bind(this)}
                />
              </div>
            )}
          </div>
          {reverseInquiries.length === 0 ? (
            <div
              className={classNames(styles.emptyNote, {
                [styles.borrower]: user.isBorrower,
                [styles.lender]: !user.isBorrower,
              })}
            >
              No Requests To Date
            </div>
          ) : (
            <div className={styles.reverseInquiryTable}>
              {reverseInquiries.map((reverseInquiry, index) => {
                return (
                  <div className={styles.contentRow} key={index}>
                    <p className={styles.contentNumber}>{reverseInquiry.id + 1}</p>
                    <p className={styles.contentsTitle}>
                      <Link to={`/reverseinquiry/content?id=${reverseInquiry.id}`}>{reverseInquiry.title}</Link>
                    </p>
                    <div className={styles.timeColumn}>{TimeConverter(reverseInquiry.insertTime)}</div>
                  </div>
                );
              })}
            </div>
          )}
        </Container>
        <RayonModalView
          isModalOpen={this.state.isSignUpModalOpen}
          onRequestClose={this.onRequestModalDisplayToggle.bind(this)}
        >
          <ReverseInquiryRegisterVC onRequestModalClose={this.onRequestModalDisplayToggle.bind(this)} />
        </RayonModalView>
      </Fragment>
    );
  }
}

export default ReverseInquiryBoardVC;
