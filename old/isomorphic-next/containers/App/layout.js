import React, { Component } from 'react';
import { connect } from 'react-redux';
import WindowResizeListener from 'react-window-size-listener';
import { Debounce } from 'react-throttle';
import { Layout, LocaleProvider } from 'antd';
import { IntlProvider } from 'react-intl';
import { ThemeProvider } from 'styled-components';
import { initGA, logPageView } from '../../helpers/analytics';
import Sidebar from '../Sidebar/Sidebar';
import ThemeSwitcher from '../ThemeSwitcher';
import Topbar from '../Topbar/Topbar';
import themes from '../../config/themes';
import { siteConfig } from '../../config/index';
import authAction from '../../redux/auth/actions';
import appActions from '../../redux/app/actions';
import AppLocale from '../../languageProvider';
import AppHolder from './commonStyle';

const { toggleAll } = appActions;
const { Content, Footer } = Layout;

class Header extends Component {
  render() {
    const { locale, selectedTheme, isLoggedIn } = this.props;
    const currentAppLocale = AppLocale[locale];
    if (this.props.App.height === 0) {
      return (
        <div>
          <Debounce time="1000" handler="onResize">
            <WindowResizeListener
              onResize={windowSize =>
                this.props.toggleAll(
                  windowSize.windowWidth,
                  windowSize.windowHeight
                )}
            />
          </Debounce>
        </div>
      );
    }
    return (
      <header>
        <LocaleProvider locale={currentAppLocale.antd}>
          <IntlProvider
            locale={currentAppLocale.locale}
            messages={currentAppLocale.messages}
          >
            <ThemeProvider theme={themes[selectedTheme]}>
              <AppHolder>
                <Layout style={{ height: '100vh' }}>
                  <Debounce time="1000" handler="onResize">
                    <WindowResizeListener
                      onResize={windowSize =>
                        this.props.toggleAll(
                          windowSize.windowWidth,
                          windowSize.windowHeight
                        )}
                    />
                  </Debounce>
                  <Topbar />
                  <Layout style={{ flexDirection: 'row', overflowX: 'hidden' }}>
                    <Sidebar />
                    <Layout
                      className="isoContentMainLayout"
                      style={{
                        height: '100vh'
                      }}
                    >
                      <Content
                        className="isomorphicContent"
                        style={{
                          padding: '70px 0 0',
                          flexShrink: '0',
                          background: '#f1f3f6',
                          width: '100%'
                        }}
                      >
                        {this.props.children}
                      </Content>
                      <Footer
                        style={{
                          background: '#ffffff',
                          textAlign: 'center',
                          borderTop: '1px solid #ededed'
                        }}
                      >
                        {siteConfig.footerText}
                      </Footer>
                    </Layout>
                  </Layout>
                  <ThemeSwitcher />
                </Layout>
              </AppHolder>
            </ThemeProvider>
          </IntlProvider>
        </LocaleProvider>
      </header>
    );
  }
}
const mapStateToProps = state => {
  return {
    App: state.App.toJS(),
    locale: state.LanguageSwitcher.toJS().language.locale,
    selectedTheme: state.ThemeSwitcher.toJS().changeThemes.themeName
  };
};
export default connect(mapStateToProps, { toggleAll })(Header);
