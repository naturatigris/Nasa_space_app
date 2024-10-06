
import pandas as pd
from dash import Dash, dcc, html, Input, Output
import plotly.graph_objs as go
import requests
import google.generativeai as genai

# Directly set your API key here
api_key = "AIzaSyB3tEmB75joNZztvjNF4_zGh8evGKxYPuk"

# Configure the API key
genai.configure(api_key=api_key)

# Load the dataset
df = pd.read_csv('Visualization/climate_website/data/combined_data.csv')
df['date'] = pd.to_datetime(df['date'])

# Define a color mapping for different locations
location_colors = {
    'aao': 'blue',
    'abp': 'green',
    'act': 'orange',
    'alt': 'purple',
    'ams': 'pink',
    'amy': 'cyan',
    'aoc': 'magenta',
    'asc': 'lime',
    'ask': 'brown',
    'avi': 'black'
}

# Create a Dash app
app = Dash(__name__)

# Navbar with inline styles

# Layout of the app
# Layout of the app
app.layout = html.Div([
    html.Nav(
        className="navbar",
        style={
            "display": "flex",
            "justifyContent": "space-between",
            "alignItems": "center",
            "background": "rgba(0, 0, 0, 0.8)",
            "padding": "15px 20px",
            "color": "white",
            "position": "fixed",
            "top": "0",
            "width": "100%",
            "margin-right": "20px",
            "zIndex": "1",
            "boxShadow": "0 2px 5px rgba(0, 0, 0, 0.2)"
        },
        children=[
            html.Div(className="logo", children=[
                html.Img(
                    src='/static/IMG/logo.png',  # Correctly reference the static logo path
                    alt="Green Minds Logo",
                    style={"height": "40px", "width": "40px", "borderRadius": "50%", "objectFit": "cover"}
                ),
                html.Span(" Green Minds", style={"color": "white", "fontSize": "24px", "marginLeft": "10px"})
            ]),
            html.Ul(className="nav-links", style={
                "listStyle": "none",  # Remove bullet points
                "display": "flex",  # Align items horizontally
                "padding": "0",  # Remove default padding
                "margin": "0"  # Remove default margin
            }, children=[
                html.Li(html.A("Home", href="/", style={"color": "white", "textDecoration": "none", "padding": "10px"})),
                html.Li(html.A("About", href="/about", style={"color": "white", "textDecoration": "none", "padding": "10px"})),
                html.Li(html.A("Dashboard", href="/dashboard", target="_blank", style={"color": "white", "textDecoration": "none", "padding": "10px"})),
                html.Li(html.A("Climate Quiz", href="/roadmap", style={"color": "white", "textDecoration": "none", "padding": "10px"})),
                html.Li(html.A("Multimedia Gallery", href="/gallery", style={"color": "white", "textDecoration": "none", "padding": "10px"})),
                html.Li(html.A("Climate Stories", href="/narrative", style={"color": "white", "textDecoration": "none", "padding": "10px"})),
            ])
        ]
    ),


    html.H1("CO2 and CH4 Emission Dashboard", style={'textAlign': 'center', 'color': 'teal', "marginTop":"90px",}),

    dcc.Dropdown(
        id='gas-dropdown',
        options=[
            {'label': 'CO2', 'value': 'CO2'},
            {'label': 'CH4', 'value': 'CH4'}
        ],
        value='CO2',  # Default value
        style={'width': '50%', 'margin': '0 auto'}
    ),

    dcc.DatePickerRange(
        id='date-picker',
        start_date=df['date'].min(),
        end_date=df['date'].max(),
        display_format='YYYY-MM-DD',
        style={'width': '50%', 'margin': '20px auto'}
    ),

    dcc.Graph(id='time-series-graph'),

    dcc.Graph(id='map-graph'),

    html.Div(id='graph-explanation', style={
        'marginTop': '20px',
        'backgroundColor': '#f4f4f4',
        'borderRadius': '10px',
        'padding': '20px',
        'maxWidth': '800px',
        'margin': '20px auto',
        'boxShadow': '0 4px 8px rgba(0, 0, 0, 0.1)',
        'fontFamily': 'Arial, sans-serif',
        'lineHeight': '1.6',
        'color': '#333'
    })
])
def fetch_real_time_data(gas_type, start_date, end_date):
    base_url = "https://api.gemini.com/v1/data/"  # Adjust according to the actual API documentation

    url = f"{base_url}{gas_type}/?start_date={start_date}&end_date={end_date}&api_key={api_key}"
    print(f"Fetching data from URL: {url}")  # Debugging URL

    response = requests.get(url)

    if response.status_code == 200:
        real_time_data = pd.DataFrame(response.json())
        real_time_data['date'] = pd.to_datetime(real_time_data['date'])
        return real_time_data
    else:
        print(f"Error fetching data from Gemini API: {response.status_code} - {response.text}")
        return pd.DataFrame()  # Return an empty DataFrame in case of an error
def parse_story(story):
    """Dynamically parse the story content and convert it into Dash HTML components."""
    paragraphs = []
    
    # Split the story into lines
    lines = story.split('\n')
    
    for line in lines:
        # Bold text for headings
        if '**' in line:
            paragraphs.append(html.P(line.replace('**', ''), style={'fontWeight': 'bold'}))
        
        # Bullet points
        elif line.startswith('•'):
            paragraphs.append(html.P(line))
        
        # Normal paragraph text
        else:
            paragraphs.append(html.P(line))
    
    return paragraphs
# Callback to update the graph based on user input
@app.callback(
    [Output('time-series-graph', 'figure'),
     Output('map-graph', 'figure'),
     Output('graph-explanation', 'children')],
    [Input('gas-dropdown', 'value'),
     Input('date-picker', 'start_date'),
     Input('date-picker', 'end_date')]
)
def update_graph(selected_gas, start_date, end_date):
    # Fetch real-time data
    real_time_data = fetch_real_time_data(selected_gas, start_date, end_date)
    
    # Filter the historical data
    filtered_df = df[(df['gas_type'] == selected_gas) & 
                     (df['date'] >= start_date) & 
                     (df['date'] <= end_date)]
    
    # Combine real-time data with historical data if available
    if not real_time_data.empty:
        combined_df = pd.concat([filtered_df, real_time_data])
    else:
        combined_df = filtered_df
    
    # Time Series Graph
    time_series_figure = {
        'data': [
            go.Scatter(
                x=combined_df['date'],
                y=combined_df['value'],
                mode='lines+markers',
                name=selected_gas,
                marker=dict(color='orange' if selected_gas == 'CO2' else 'blue'),
                line=dict(width=2)
            )
        ],
        'layout': go.Layout(
            title=f'{selected_gas} Concentration Over Time',
            xaxis={'title': 'Date'},
            yaxis={'title': 'Concentration'},
            hovermode='closest'
        )
    }

    # Map Graph with colorful markers based on location
    map_data = []
    for location, color in location_colors.items():
        loc_data = combined_df[combined_df['Site Name'] == location]  # Filter data by location
        if not loc_data.empty:  # Only add if there's data for that location
            map_data.append(go.Scattermapbox(
                lat=loc_data['latitude'],
                lon=loc_data['longitude'],
                mode='markers',
                marker=dict(size=10, opacity=0.7, color=color),  # Use the color from mapping
                text=loc_data['value'],
                name=location  # Name by location
            ))

    map_figure = {
        'data': map_data,
        'layout': go.Layout(
            title=f'{selected_gas} Emissions by Location',
            mapbox=dict(
                style="carto-positron",  # You can replace with your Mapbox style if needed
                center=dict(lat=combined_df['latitude'].mean(), lon=combined_df['longitude'].mean()),
                zoom=3
            ),
            showlegend=True
        )
    }
    
    def generate_compelling_story(df, gas_type):
        latest_value = df['value'].iloc[-1]
        previous_value = df['value'].iloc[-2]
        percentage_change = ((latest_value - previous_value) / previous_value) * 100
        
        # Prepare the content for the generative model
        content_request = f"Generate a compelling insights and pattern in points about the recent trends in {gas_type} emissions based on the latest value of {latest_value} and previous value of {previous_value} and also give call to action ."

        response = genai.GenerativeModel("gemini-1.5-flash").generate_content(content_request)
        story = response.text

        # Return the generated story
        return story

    # Generate story and explanation
    story = generate_compelling_story(combined_df, selected_gas)

    parsed_story = parse_story(story)
    
    explanation = [
        html.H3("Understanding the Graphs"),
        html.P(f"The first graph shows the concentration of {selected_gas} over time. "
               "It allows us to observe trends and fluctuations in emissions, which can be correlated "
               "with major events or changes in policy."),
        html.P(f"The second graph provides a geographical representation of {selected_gas} emissions. "
               "By visualizing emissions by location, we can identify hotspots and areas where further action may be required."),
        html.H3("Compelling Story Based on Data:"),
        html.Div(parsed_story, style={'lineHeight': '1.8', 'color': '#333'})
    ]

    return time_series_figure, map_figure, explanation

# Run the app
if __name__ == '__main__':
    app.run_server(debug=True)

