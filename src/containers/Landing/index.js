import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import styled from 'react-emotion';
import {
	H1,
	H2,
	H3,
	P,
	Ol,
	Ul,
	Button,
	Input,
	Label,
	ErrorInput,
} from '../../utils/content';

const LandingMain = styled('div')``;

const KitchenSinkContainer = styled('div')`
	padding: 10px 20px;
	max-width: 700px;
`;

class Landing extends Component {
	render() {
		return (
			<LandingMain>
				<Link to="/app">Go to App</Link>
				<H1>HTML Ipsum Presents</H1>

				<P>
					<strong>Pellentesque habitant morbi tristique</strong>{' '}
					senectus et netus et malesuada fames ac turpis egestas.
					Vestibulum tortor quam, feugiat vitae, ultricies eget,
					tempor sit amet, ante. Donec eu libero sit amet quam egestas
					semper. <em>Aenean ultricies mi vitae est.</em> Mauris
					placerat eleifend leo. Quisque sit amet est et sapien
					ullamcorper pharetra. Vestibulum erat wisi, condimentum sed,{' '}
					<code>commodo vitae</code>, ornare sit amet, wisi. Aenean
					fermentum, elit eget tincidunt condimentum, eros ipsum
					rutrum orci, sagittis tempus lacus enim ac dui.{' '}
					<a href="#">Donec non enim</a> in turpis pulvinar facilisis.
					Ut felis.
				</P>

				<H2>Header Level 2</H2>

				<Ol>
					<li>
						Lorem ipsum dolor sit amet, consectetuer adipiscing
						elit.
					</li>
					<li>Aliquam tincidunt mauris eu risus.</li>
				</Ol>

				<blockquote>
					<P>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						Vivamus magna. Cras in mi at felis aliquet congue. Ut a
						est eget ligula molestie gravida. Curabitur massa. Donec
						eleifend, libero at sagittis mollis, tellus est
						malesuada tellus, at luctus turpis elit sit amet quam.
						Vivamus pretium ornare est.
					</P>
				</blockquote>

				<P>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					Vivamus magna. Cras in mi at felis aliquet congue. Ut a est
					eget ligula molestie gravida. Curabitur massa. Donec
					eleifend, libero at sagittis mollis, tellus est malesuada
					tellus, at luctus turpis elit sit amet quam. Vivamus pretium
					ornare est.
				</P>

				<H3>Header Level 3</H3>

				<P>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					Vivamus magna. Cras in mi at felis aliquet congue. Ut a est
					eget ligula molestie gravida. Curabitur massa. Donec
					eleifend, libero at sagittis mollis, tellus est malesuada
					tellus, at luctus turpis elit sit amet quam. Vivamus pretium
					ornare est.
				</P>

				<Ul>
					<li>
						Lorem ipsum dolor sit amet, consectetuer adipiscing
						elit.
					</li>
					<li>Aliquam tincidunt mauris eu risus.</li>
				</Ul>

				<P>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					Vivamus magna. Cras in mi at felis aliquet congue. Ut a est
					eget ligula molestie gravida. Curabitur massa. Donec
					eleifend, libero at sagittis mollis, tellus est malesuada
					tellus, at luctus turpis elit sit amet quam. Vivamus pretium
					ornare est.
				</P>
				<P>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					Vivamus magna. Cras in mi at felis aliquet congue. Ut a est
					eget ligula molestie gravida. Curabitur massa. Donec
					eleifend, libero at sagittis mollis, tellus est malesuada
					tellus, at luctus turpis elit sit amet quam. Vivamus pretium
					ornare est.
				</P>
				<P>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					Vivamus magna. Cras in mi at felis aliquet congue. Ut a est
					eget ligula molestie gravida. Curabitur massa. Donec
					eleifend, libero at sagittis mollis, tellus est malesuada
					tellus, at luctus turpis elit sit amet quam. Vivamus pretium
					ornare est.
				</P>
				<KitchenSinkContainer>
					<Button theme="Primary" size="Big">
						Bonjour
					</Button>
					<Button theme="Primary" size="Medium">
						Bonjour
					</Button>
					<Button theme="Primary" size="Small">
						Bonjour
					</Button>
					<br />
					<br />
					<Button theme="Link" size="Big">
						Bonjour
					</Button>
					<Button theme="Link" size="Medium">
						Bonjour
					</Button>
					<Button theme="Link" size="Small">
						Bonjour
					</Button>
					<br />
					<br />
					<Button theme="Disabled" size="Big">
						Bonjour
					</Button>
					<Button theme="Disabled" size="Medium">
						Bonjour
					</Button>
					<Button theme="Disabled" size="Small">
						Bonjour
					</Button>
					<br />
					<br />
					<Button theme="Outline" size="Big">
						Bonjour
					</Button>
					<Button theme="Outline" size="Medium">
						Bonjour
					</Button>
					<Button theme="Outline" size="Small">
						Bonjour
					</Button>
					<br />
					<br />
					<Button theme="PrimaryNavy" size="Big">
						Bonjour
					</Button>
					<Button theme="PrimaryNavy" size="Medium">
						Bonjour
					</Button>
					<Button theme="PrimaryNavy" size="Small">
						Bonjour
					</Button>
					<br />
					<br />
					<Button theme="Warning" size="Big">
						Bonjour
					</Button>
					<Button theme="Warning" size="Medium">
						Bonjour
					</Button>
					<Button theme="Warning" size="Small">
						Bonjour
					</Button>
					<br />
					<br />
					<Button theme="Error" size="Big">
						Bonjour
					</Button>
					<Button theme="Error" size="Medium">
						Bonjour
					</Button>
					<Button theme="Error" size="Small">
						Bonjour
					</Button>
					<br />
					<br />
					<Button theme="Success" size="Big">
						Bonjour
					</Button>
					<Button theme="Success" size="Medium">
						Bonjour
					</Button>
					<Button theme="Success" size="Small">
						Bonjour
					</Button>
					<br />
					<br />

					<Button theme="Default" size="Big">
						Bonjour
					</Button>
					<Button theme="Default" size="Medium">
						Bonjour
					</Button>
					<Button theme="Default" size="Small">
						Bonjour
					</Button>
					<br />
					<br />
					<br />
					<Input type="text" placeholder="bonjour" />
					<br />
					<br />
					<Input type="text" placeholder="bonjour" error />
					<br />
					<br />
					<Input type="text" placeholder="bonjour" disabled />
					<br />
					<br />
					<Label>With label</Label>
					<Input type="text" placeholder="bonjour" />
					<br />
					<br />
					<Label required>With label required</Label>
					<Input type="text" placeholder="bonjour" />
					<br />
					<br />
					<Label required>With error</Label>
					<Input type="text" placeholder="bonjour" error />
					<ErrorInput>Error message</ErrorInput>
				</KitchenSinkContainer>
				<pre>
					<code>
						{`#header H1 a {
            display: block;
          width: 300px;
          height: 80px;
        }`}
					</code>
				</pre>
			</LandingMain>
		);
	}
}

export default Landing;
