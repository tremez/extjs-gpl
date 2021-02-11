/**
 * Note that this data can be loaded as a linear Store, or as a TreeStore by virtue of the
 * parentId upward link from child nodes.
 */
Ext.define('KitchenSink.data.Staff', {
    requires: [
        'KitchenSink.data.Init'
    ]
}, function() {
    Ext.ux.ajax.SimManager.register({
        '/KitchenSink/StaffData': {
            type: 'json',
            data: [{
                name: 'Cliff Capote',
                email: 'bossman@example.com',
                id: 1,
                title: 'CEO',
                avatar: '1.jpg',
                expanded: true
            }, {
                name: 'Rina Hohn',
                email: 'rina@example.com',
                id: 4,
                parentId: 1,
                title: 'Vice President, Engineering',
                avatar: '4.jpg',
                expanded: true
            }, {
                name: 'Edgardo Elvin',
                email: 'edgardo@example.com',
                id: 2,
                parentId: 4,
                title: 'Director of Engineering',
                avatar: '2.jpg',
                expanded: true
            }, {
                name: 'Martin Patlan',
                email: 'martin@example.com',
                id: 13,
                parentId: 2,
                title: 'Sr. Software Architect',
                avatar: '13.jpg'
            }, {
                name: 'Paola Motes',
                email: 'paola@example.com',
                id: 8,
                parentId: 2,
                title: 'Sr. Software Engineer',
                avatar: '8.jpg'
            }, {
                name: 'Angelo Aden',
                email: 'angelo@example.com',
                id: 12,
                parentId: 2,
                title: 'Sr. Software Engineer',
                avatar: '12.jpg'
            }, {
                name: 'Christina Timmins',
                email: 'christina@example.com',
                id: 14,
                parentId: 2,
                title: 'Sr. Software Engineer',
                avatar: '14.jpg'
            }, {
                name: 'Derrick Curtsinger',
                email: 'derrick@example.com',
                id: 15,
                parentId: 2,
                title: 'Software Engineer',
                avatar: '15.jpg'
            }, {
                name: 'Freda Mcmurray',
                email: 'freda@example.com',
                id: 9,
                parentId: 4,
                title: 'Sr. Engineering Manager',
                avatar: '9.jpg'
            }, {
                name: 'Ramiro Frew',
                email: 'ramiro@example.com',
                id: 5,
                parentId: 1,
                title: 'Vice President, Marketing',
                avatar: '5.jpg',
                expanded: true
            }, {
                name: 'Conrad Yohe',
                email: 'conrad@example.com',
                id: 3,
                parentId: 5,
                title: 'Sr. Director, Product Management',
                avatar: '3.jpg'
            }, {
                name: 'Marita Meserve',
                email: 'marita@example.com',
                id: 7,
                parentId: 1,
                title: 'Senior Vice President and Chief Financial Officer',
                avatar: '7.jpg'
            }, {
                name: 'Tory Orban',
                email: 'tory@example.com',
                id: 10,
                parentId: 1,
                title: 'Vice President, Global Alliances & Professional Services',
                avatar: '10.jpg',
                expanded: true
            }, {
                name: 'Jarred Lasky',
                email: 'jarred@example.com',
                id: 11,
                parentId: 10,
                title: 'Principal Architect',
                avatar: '11.jpg'
            }]
        }
    });
});
