import React, {useEffect, useState} from 'react';

const API_HOST = 'http://localhost:8000';

// React component
function TestAPI() {

    const [state, setState] = useState({
        testGet: 'KO',
        testPost: 'KO',
    });


    useEffect(() => {
        let _csrfToken: string = '';

        async function getCsrfToken() {
            if (_csrfToken === '') {
                const response = await fetch(`${API_HOST}/csrf/`, {
                    credentials: 'include',
                });
                const data = await response.json();
                _csrfToken = data.csrfToken;
            }
            return _csrfToken;
        }

        async function testRequest(method: string) {
            const response = await fetch(`${API_HOST}/streeplijst/members/s1779397`, {
                method: method,
                headers: (
                    method === 'POST'
                        ? {'X-CSRFToken': await getCsrfToken()}
                        : {}
                ),
                credentials: 'include',
            });
            const data = await response.json();

            if (method === 'GET') {
                setState({
                    ...state,
                    testGet: data.result
                });
            } else if (method === 'POST') {
                setState({
                    ...state,
                    testPost: data.result
                });
            }
        }

        // testRequest('POST');
        testRequest('GET');
    }, [])

    return (
        <div>
            <p>Test GET request: {state.testGet}</p>
            <p>Test POST request: {state.testPost}</p>
        </div>
    );
}


// Exports
export default TestAPI;