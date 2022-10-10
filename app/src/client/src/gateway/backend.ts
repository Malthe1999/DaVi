export const getData = async<T>(resource: string) : Promise<T> => {
    const res = await fetch(`http://localhost:17500/api/${resource}`, {
        method: 'Get',
        headers: {
            'Content-type': 'application/json'
        },
    });

    return await res.json();
}
