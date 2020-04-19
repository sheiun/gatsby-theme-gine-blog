import React from 'react'
import Bottom from './bottom'
import '../../index.css'
import { withStyles } from '@material-ui/core/styles'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import NavList from './nav-list'
import { Helmet } from "react-helmet"
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import SearchButton from '../search/search'
import { StaticQuery, graphql } from "gatsby"
import icon from '../../static/favicon.ico'

// import SearchButton from './search/search'

const styles = {
    root: {
        position: 'fixed',
        top: 0,
    },
    menuButton: {
        top: 0,
        marginLeft: 0,
        marginRight: 20,
        position: 'absolute',
        zIndex: 100
    },
    drawer: {
        width: 300,
    },
}

class Layout extends React.Component {
    toggleDrawer = (open) => () => {
        this.setState({
            open: open,
        })
    }

    constructor(props) {
        super(props)
        this.state = {
            open: false,
            iOS: undefined,
            height: 0,
            data: {
                music: {},
                game: {}

            }
        }
    }

    back2Top = () => {
        let top = document.getElementById("top")
        top.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" })
    }

    componentDidMount() {
        const iOS = process.browser &&
            /iPad|iPhone|iPod/.test(navigator.userAgent)

        let height = window.innerHeight || document.body.clientHeight ||
            document.documentElement.clientHeight

        // 优化移动端滚动
        // document.addEventListener('touchstart', onTouchStart, {passive: true});

        this.setState({
            iOS,
            height,
        })
    }

    render() {
        const { open, iOS, height, data: { music, game } } = this.state
        const { classes, title, navStyle = {}, wrapStyle = {} } = this.props

        return (
            <StaticQuery
                query={graphql`
          {
              siteConfig {
                  netlifyUrl
                  pageSize
                  siteUrl
                  title
                  description
                  copyrightUrl
                  copyrightName
                  commentOpen
                  commentDisqusShortname
                  aboutPostSlug
                  momentsOpen
                  booksOpen
                  aphorismsOpen
                  searchOpen
              }
              allAphorisms {
                nodes {
                  person
                  source
                  content
                }
              }
              sourceConfig(name: {eq: "posts"}) {
                table
              }
          }`}
                render={data => (
                    <div>
                        <Helmet defaultTitle={`${data.siteConfig.title}${title ? ` - ${title}` : ""}`}>
                            <html lang="zh-Hant" />
                            <meta name="description" content={`${data.siteConfig.title} `} />
                            <link rel="shortcut icon" href={icon} />
                            <noscript>
                                為了更好的瀏覽體驗，請不要在本頁面禁用 Javascript 🙂
                    </noscript>
                        </Helmet>
                        {/* {
                    config.google_ad_client.open && <Helmet>
                        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
                        <script>
                            {
                                `(adsbygoogle = window.adsbygoogle || []).push({
                                        google_ad_client: "${config.google_ad_client.clientId}",
                                        enable_page_level_ads: true
                                    })`
                            }
                        </script>
                    </Helmet>
                } */}

                        <SwipeableDrawer
                            disableBackdropTransition={!iOS}
                            disableDiscovery={iOS}
                            open={open}
                            onOpen={this.toggleDrawer(true)}
                            SwipeAreaProps={{ onMouseEnter: this.toggleDrawer(true) }}
                            onClose={this.toggleDrawer(false)}>
                            <div
                                className={classes.drawer}
                                tabIndex={0}
                                role="button"
                                onClick={this.toggleDrawer(false)}
                                onKeyDown={this.toggleDrawer(false)}
                            >
                                <NavList siteConfig={data.siteConfig} />
                            </div>
                        </SwipeableDrawer>
                        {/* <AppBar position="sticky">
                    <Toolbar style={{ minHeight: 48 }}> */}
                        <div style={{
                            height: 40,
                            position: "fixed",
                            width: '100%',
                            top: 0,
                            zIndex: 999,
                            ...navStyle
                        }}>
                            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.toggleDrawer(true)} centerRipple={false}>
                                <MenuIcon />
                            </IconButton>

                            <div style={{ wdith: '100%', height: '100%' }} onClick={this.back2Top}>

                            </div>
                            {data.siteConfig.searchOpen && <SearchButton sourceUrl={data.sourceConfig.table} />}
                        </div>

                        {/* </Toolbar>
                </AppBar> */}
                        <div id="top"></div>
                        <div style={{ margin: `0 auto`, marginTop: '40px', ...wrapStyle }}>
                            {this.props.children}
                        </div>

                        <Bottom siteConfig={data.siteConfig} allAphorisms={data.allAphorisms.nodes} />
                    </div>
                )}
            />
        )
    }
}

export default withStyles(styles)(Layout)
